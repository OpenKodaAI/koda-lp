import Link from "next/link";
import { Callout } from "./callout";
import { CodeBlock } from "./code-block";

export function IntegrationsReverseProxy() {
  return (
    <>
      <p>
        Koda binds its HTTP surfaces to <code>127.0.0.1</code> in production.
        A reverse proxy fronts the stack, terminates TLS, and routes requests
        to the right port. This page shows working configurations for Caddy,
        nginx, and Tailscale.
      </p>

      <h2 id="what-to-publish">What to publish</h2>
      <p>
        Only two backends, five paths. Everything else stays inside the
        compose network.
      </p>
      <ul>
        <li>
          <code>127.0.0.1:3000</code> — Next.js dashboard. Owns{" "}
          <code>/</code> and <code>/control-plane/</code>.
        </li>
        <li>
          <code>127.0.0.1:8090</code> — control plane + runtime API. Owns{" "}
          <code>/api/control-plane/*</code>, <code>/api/runtime/*</code>, and
          the OpenAPI at <code>/openapi/control-plane.json</code>.
        </li>
        <li>
          Optionally: publish <code>/setup</code> on the dashboard if you
          want a compatibility redirect into the first-run flow.
        </li>
      </ul>

      <h2 id="caddy">Caddy</h2>
      <p>
        Caddy is the fastest path. It auto-provisions TLS through Let's
        Encrypt and ships sensible security headers by default.
      </p>
      <CodeBlock
        language="text"
        code={`koda.example.com {
  # Dashboard + operator surface
  reverse_proxy / 127.0.0.1:3000
  reverse_proxy /control-plane/* 127.0.0.1:3000

  # Control plane + runtime APIs
  reverse_proxy /api/control-plane/* 127.0.0.1:8090
  reverse_proxy /api/runtime/* 127.0.0.1:8090
  reverse_proxy /openapi/* 127.0.0.1:8090

  # Optional: first-run compatibility
  reverse_proxy /setup 127.0.0.1:3000

  # Hide server identity
  header -Server

  # Don't cache auth pages
  @auth path /login /setup /forgot-password
  header @auth Cache-Control "no-store, no-cache, must-revalidate"
}`}
      />

      <h2 id="nginx">nginx</h2>
      <p>
        Slightly more boilerplate but handles every custom case you might
        need. Assumes TLS is terminated by nginx — certificate paths need to
        match your setup.
      </p>
      <CodeBlock
        language="text"
        code={`server {
  listen 443 ssl http2;
  server_name koda.example.com;

  ssl_certificate     /etc/letsencrypt/live/koda.example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/koda.example.com/privkey.pem;
  ssl_protocols TLSv1.2 TLSv1.3;

  # Strip server identity
  server_tokens off;
  more_clear_headers 'Server';

  # Dashboard (Next.js)
  location / {
    proxy_pass         http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header   Host              $host;
    proxy_set_header   X-Real-IP         $remote_addr;
    proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto $scheme;
    proxy_set_header   Upgrade           $http_upgrade;
    proxy_set_header   Connection        "upgrade";
  }

  # Control plane + runtime APIs
  location ~ ^/(api/control-plane|api/runtime|openapi)/ {
    proxy_pass         http://127.0.0.1:8090;
    proxy_http_version 1.1;
    proxy_set_header   Host              $host;
    proxy_set_header   X-Real-IP         $remote_addr;
    proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto $scheme;
  }
}

# HTTP → HTTPS redirect
server {
  listen 80;
  server_name koda.example.com;
  return 301 https://$host$request_uri;
}`}
      />

      <h2 id="tailscale">Tailscale (private access)</h2>
      <p>
        If you want operator-only access without a public hostname, Tailscale
        Funnel publishes a URL that only devices on your tailnet can reach.
      </p>
      <ol>
        <li>
          Install Tailscale on the Koda host and authenticate.
        </li>
        <li>
          Run <code>tailscale serve http://127.0.0.1:3000</code> for the
          dashboard.
        </li>
        <li>
          Run <code>tailscale serve --bg --https=8090 http://127.0.0.1:8090</code>{" "}
          if you need the API reachable from other tailnet peers.
        </li>
        <li>
          Optional: enable <code>tailscale funnel</code> to publish the
          dashboard over the public internet (still Tailscale-authenticated).
        </li>
      </ol>

      <h2 id="headers">Required response behaviour</h2>
      <p>
        The stack relies on a handful of transport properties that proxies
        must not strip.
      </p>
      <ul>
        <li>
          <strong>HTTPS everywhere.</strong> The session cookie{" "}
          <code>koda_operator_session</code> is flagged <code>Secure</code>{" "}
          — the browser will refuse to send it over plain HTTP.
        </li>
        <li>
          <strong>WebSocket upgrade</strong> for the dashboard (Next.js uses
          upgraded connections for HMR in dev and for dashboard streaming in
          production).
        </li>
        <li>
          <strong><code>X-Forwarded-Proto</code></strong> and{" "}
          <code>X-Forwarded-For</code> — the control plane uses them for rate
          limiting by IP and for constructing canonical URLs.
        </li>
        <li>
          <strong>Don't patch in <code>{"'unsafe-inline'"}</code></strong>{" "}
          Content-Security-Policy overrides. The auth pages enforce strict
          CSP deliberately.
        </li>
      </ul>

      <Callout variant="tip" title="Cloudflare Tunnel">
        Cloudflare Tunnel works similarly to Tailscale Funnel: create a
        tunnel, point two hostnames at <code>127.0.0.1:3000</code> and{" "}
        <code>127.0.0.1:8090</code>, and Cloudflare handles TLS and
        forwarding. Leave the default proxy enabled so the origin never
        hears from the public internet directly.
      </Callout>

      <h2 id="verify">Verify the setup</h2>
      <p>Four checks before going live:</p>
      <ul>
        <li>
          <code>curl -I https://koda.example.com/</code> → 200 OK, dashboard
          HTML.
        </li>
        <li>
          <code>curl -I https://koda.example.com/api/control-plane/health</code>{" "}
          → JSON health payload.
        </li>
        <li>
          Open the dashboard, sign in, check DevTools → Application →
          Cookies. <code>koda_operator_session</code> must show{" "}
          <code>Secure</code>, <code>HttpOnly</code>, and{" "}
          <code>SameSite=Strict</code>.
        </li>
        <li>
          The auth pages (<code>/login</code>, <code>/setup</code>,{" "}
          <code>/forgot-password</code>) send a strict CSP header. Confirm in
          DevTools → Network → Response Headers.
        </li>
      </ul>

      <h2 id="next">Next steps</h2>
      <ul>
        <li>
          <Link href="/docs/deployment/vps">VPS deployment</Link> — the full
          production checklist the reverse proxy sits in front of.
        </li>
        <li>
          <Link href="/docs/operations/security">Security</Link> — the headers
          and cookie flags the proxy must preserve.
        </li>
      </ul>
    </>
  );
}
