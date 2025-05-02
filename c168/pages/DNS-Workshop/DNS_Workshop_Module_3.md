# Module 3: Operational DNS

---

## 3.1 Recursive Queries

Recursive DNS servers handle resolution on behalf of clients by performing all the necessary queries across the DNS hierarchy until they find a final answer.

**Process:**
1. Client queries a recursive resolver (e.g., 1.1.1.1)
2. Resolver checks its cache
3. If no match, it contacts the root server, then the TLD, then the authoritative server
4. Result is returned to client and cached

```
dig +trace openai.com
```

### Lab:
- Identify your default resolver using `nslookup` or `dig`
- Flush DNS cache, then resolve `example.com` and analyze timings

---

## 3.2 Glue Records

Glue records are A or AAAA records placed in the **parent zone** to resolve the IP address of a nameserver that is **within the child zone** it serves.

### Why glue is needed:
- Prevent circular dependency
- Ensure resolvers can reach the nameserver

### Example:
Domain: `example.com`
Nameserver: `ns1.example.com`

Glue record:
```
example.com. IN NS ns1.example.com.
ns1.example.com. IN A 192.0.2.1  ← glue record
```

### Lab:
```
dig com NS
dig example.com NS +additional
```

---

## 3.3 DNS Caching and TTL

Caching is crucial for DNS performance and scalability. When a resolver answers a query, it stores the result for a time defined by the **TTL** (Time To Live).

### TTL effects:
- Lower TTL = faster update propagation
- Higher TTL = less resolver load

### Lab:
```
dig example.com
```
Check the `TTL` column in the response.

---

## 3.4 Negative Caching

When a resolver receives an **NXDOMAIN** (non-existent domain) response, it caches that too — this is called **negative caching**.

Negative TTL is controlled by the SOA record’s `minimum` field:
```
dig example.com SOA
```

Try:
```
dig nonexistent.example.com
```

---

## 3.5 DNS Protocol Structure

A DNS message consists of:
- Header
- Question
- Answer
- Authority
- Additional

It uses:
- UDP (default for queries)
- TCP (zone transfers, large responses)

```
sudo tcpdump -i any port 53
```

Use Wireshark to visualize each section of a query.

---

## 3.6 EDNS (Extension Mechanisms for DNS)

**EDNS(0)** extends DNS to support:
- Larger UDP packet sizes (>512 bytes)
- DNSSEC data
- Future flags

Without EDNS, DNSSEC wouldn’t work.

### Lab:
```
dig example.com +edns=0 +dnssec
```

---

## 3.7 Transport Protocols

### UDP
- Default protocol for most DNS queries
- Lightweight, stateless

### TCP
- Used for zone transfers
- Fallback when UDP is truncated

### DNS over HTTPS (DoH)
- Encrypts DNS inside HTTPS
- Privacy-enhancing

### DNS over TLS (DoT)
- Encrypts DNS using TLS on port 853

Try:
- `curl https://cloudflare-dns.com/dns-query`
- Test DoH in Firefox or Chromium

---

## 3.8 Public Resolvers

Resolvers that support DNSSEC, DoH, DoT, and fast caching:

| Provider     | IP Address   | Features     |
|--------------|--------------|--------------|
| Google       | 8.8.8.8       | DNSSEC, DoT  |
| Cloudflare   | 1.1.1.1       | DoH, DoT     |
| Quad9        | 9.9.9.9       | Malware filter |

Test:
```
dig @1.1.1.1 openai.com
```

---

## 3.9 Dynamic DNS (DDNS)

DDNS allows devices to automatically update DNS records when their IP changes. Common for:
- Home routers
- VPNs
- Small office networks

Popular providers:
- DynDNS
- No-IP

Example:
```
myrouter.dyndns.org → updated IP every time the router reboots
```

---

## 3.10 Dynamic DNS Responses

DNS servers may return different results depending on:
- Geographic region
- Server load
- Query source

This is called:
- **GeoDNS**
- **Split-horizon DNS**
- **Round-robin DNS**

### Lab:
```
dig @8.8.8.8 example.com
dig @1.1.1.1 example.com
```

Compare the answers — are they different?

---

## 💡 Challenge Exercise

1. Use `dig +trace` to resolve a popular website
2. Identify TTLs at each level
3. Find a domain using GeoDNS
4. Use `tcpdump` or Wireshark to capture DNS queries
5. Switch to DoH and compare behavior

---

## 📘 Summary

This module covered:
- Recursive resolution process
- DNS caching (positive/negative)
- Message structure and packet capture
- EDNS and DNSSEC interaction
- Privacy-preserving DNS transports
- Dynamic DNS records and responses

Tools used:
- `dig`
- `tcpdump`, `Wireshark`
- DNS-over-HTTPS endpoints
- `host`, `nslookup`, browser DNS settings
