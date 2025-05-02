# Module 6: Debugging DNS Issues

---

## 6.1 Cache Invalidation

DNS records are cached at:
- Local client systems
- Operating system resolver cache
- Recursive resolvers (e.g., ISPs, public DNS)

TTL (Time To Live) dictates how long a record remains in cache.

### Manual flush commands:
- **Windows**:
```
ipconfig /flushdns
```

- **macOS**:
```
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

- **Linux (systemd)**:
```
systemd-resolve --flush-caches
```

---

## 6.2 Inspecting DNS Traffic

Use packet capture tools to view raw DNS traffic.

### Tools:
- **tcpdump**:
```
sudo tcpdump -i any port 53
```

- **Wireshark**:
Filter with:
```
dns
```

Look for:
- Query/response timing
- UDP vs TCP
- Truncation or failure flags
- Response codes (NOERROR, NXDOMAIN, SERVFAIL)

---

## 6.3 Simulating Failures

To test DNS error handling:

- Block outbound port 53 using a firewall
- Set incorrect NS or A records for a domain
- Alter `/etc/hosts` to create local override
- Lower TTL values to force frequent refresh

This is useful in red-team exercises, failover testing, or troubleshooting CI/CD pipelines.

---

## 6.4 Lame Delegation

A **lame delegation** occurs when a zone is delegated to a nameserver that:
- Exists but doesn’t respond authoritatively for the zone

### Detect it:
```
dig NS example.com
dig @ns1.example.com example.com
```

If `ns1.example.com` doesn’t answer as authoritative, it’s a lame delegation.

Use `+norecurse` to confirm:
```
dig +norecurse @ns1.example.com example.com
```

---

## 6.5 DNSSEC Validation Errors

Causes of DNSSEC failures:
- Expired RRSIG records
- Mismatched DNSKEYs
- Missing DS record in the parent zone

Validation tools:
```
dig +dnssec example.com
dig example.com RRSIG
```

Online checker:
- https://dnsviz.net/

---

## 6.6 Root Cause Analysis

When DNS fails, isolate the issue:

1. **Client-side**: DNS settings? Local cache? VPN interference?
2. **Network-side**: Can you reach port 53? Firewall rules?
3. **Upstream resolvers**: Try an alternate DNS like `1.1.1.1` or `9.9.9.9`
4. **Recursive trace**:
```
dig +trace domain.com
```
5. **Compare behavior** on another network or using mobile hotspot

---

## 6.7 Graceful DNS Changes

DNS propagation delays are caused by TTLs on previous records.

To change DNS settings smoothly:
- **Lower TTL to 300** (5 mins) at least 24 hours in advance
- **Make change**
- Wait for old TTL to expire
- **Raise TTL** back to default (e.g., 3600 or 86400)

This ensures old records expire quickly and new ones spread rapidly.

### View TTL:
```
dig example.com A
```

---

## 🛠️ Recommended Tools

| Tool       | Use Case                        |
|------------|----------------------------------|
| `dig`      | Manual lookups, tracing          |
| `host`     | Quick queries                    |
| `nslookup` | Basic Windows DNS inspection     |
| Wireshark  | Deep packet inspection           |
| tcpdump    | CLI-based DNS capture            |
| DNSViz     | DNSSEC and chain validation      |
| Zonemaster| Delegation chain diagnostics      |

---

## 💡 Challenge Exercise

1. Configure a domain with very low TTLs (e.g., 60 seconds)
2. Use `dig +trace` to follow delegation
3. Simulate a DNSSEC failure by altering zone signatures (test zone)
4. Capture and decode a full DNS query/response in Wireshark
5. Identify a real-world lame delegation via `dig +norecurse`

---

## 📘 Summary

Debugging DNS requires skills in:

- Cache management and TTL timing
- Packet analysis and root tracing
- Identifying configuration errors (lame delegations, invalid NS)
- Troubleshooting DNSSEC and propagation delays

Real-world failures often involve:
- Recursive resolver misbehavior
- Broken DNSSEC chains
- Human error in record updates

Mastering tools like `dig`, Wireshark, and DNSViz can drastically reduce troubleshooting time.
