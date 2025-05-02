# Module 4: Types of DNS Records

---

## 4.1 A and AAAA Records

**A Record**: Maps a domain to an IPv4 address  
**AAAA Record**: Maps a domain to an IPv6 address

These are the most common record types and essential for web and application services.

### Examples:
```
dig example.com A
dig example.com AAAA
```

Check your own public IP via:
```
dig +short myip.opendns.com @resolver1.opendns.com
```

---

## 4.2 CNAME Records

A **CNAME (Canonical Name)** record is used to alias one domain name to another. Useful for load balancing, branding, or CDN integration.

**Important rule**: A domain with a CNAME record **cannot** have other record types (e.g., A, MX).

### Example:
```
www.example.com. IN CNAME webhost.example.net.
```

### Lab:
```
dig www.example.com CNAME
```

---

## 4.3 TXT Records

**TXT records** allow domain owners to store arbitrary text strings. They’re commonly used for:

- SPF (email validation)
- Google site verification
- DKIM public keys

### Examples:
```
dig example.com TXT
dig _dmarc.example.com TXT
```

Look for values like:
```
"v=spf1 include:_spf.google.com ~all"
```

---

## 4.4 SRV Records

**SRV (Service)** records specify services for a domain and include:
- Service name
- Protocol (TCP or UDP)
- Priority and weight
- Port
- Target host

**Used in:** SIP, XMPP, Microsoft AD, Kerberos

### Format:
```
_service._protocol.name. TTL IN SRV priority weight port target.
```

### Example:
```
dig _sip._tcp.example.com SRV
```

---

## 4.5 PTR Records (Reverse DNS)

**PTR (Pointer)** records map IP addresses to domain names. They are the reverse of A/AAAA records.

Used for:
- Mail server validation
- Log analysis
- Security visibility

### Lookup:
```
dig -x 8.8.8.8
```

Reverse zones end with `.in-addr.arpa` (IPv4) or `.ip6.arpa` (IPv6).

---

## 4.6 NS Records

**NS (Name Server)** records define which servers are authoritative for a domain.

Example:
```
example.com. IN NS ns1.example.com.
```

Check:
```
dig example.com NS
```

Authoritative nameservers host and serve the zone data.

---

## 4.7 SOA Records

**SOA (Start of Authority)** records define administrative information about a zone:
- Primary nameserver
- Admin email
- Serial number
- Refresh, retry, and expire times
- Minimum TTL

### Example:
```
dig example.com SOA
```

---

## 4.8 DNSSEC-Related Records

When DNSSEC is enabled, additional records appear:

- **RRSIG** – Cryptographic signature
- **DNSKEY** – Public key
- **DS** – Delegation signer
- **NSEC / NSEC3** – Prove non-existence

### Lab:
```
dig +dnssec example.com
dig example.com DNSKEY
```

---

## 4.9 TLSA (for DANE)

**TLSA** records are used by DANE (DNS-based Authentication of Named Entities) to bind TLS certificates to domain names.

Format:
```
_dport._proto.domain. IN TLSA usage selector matching-type cert-association
```

Example:
```
dig _25._tcp.mail.example.com TLSA
```

---

## 4.10 ANY Queries and Record Aggregation

The `ANY` query requests all record types for a domain (though it’s deprecated in some resolvers).

Try:
```
dig example.com ANY
```

Some resolvers now return minimal or no data for `ANY` to avoid abuse.

---

## 💡 Challenge Exercise

Choose a test domain and:
- List all its A, AAAA, MX, TXT, NS, SOA records
- Check for DNSSEC (use `+dnssec`)
- Lookup its PTR record (using `-x`)
- Check SRV support for common services like `_sip._tcp`

---

## 📘 Summary

This module covers:
- Core record types: A, AAAA, CNAME, MX, TXT
- Specialized records: SRV, PTR, SOA, NS
- Security extensions: DNSSEC, TLSA
- Resolution and record inspection techniques

Tools:
- `dig`
- `host`
- `nslookup`
- Packet analyzers and online DNS checkers
