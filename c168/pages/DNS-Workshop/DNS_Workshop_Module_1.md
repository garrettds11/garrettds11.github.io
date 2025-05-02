# Module 1: DNS from First Principles

---

## 1.1 DNS as a Database

The Domain Name System (DNS) functions as a globally distributed, hierarchical database. Rather than storing structured data in tables, it maps domain names (like `example.com`) to values like IP addresses. These mappings are referred to as **resource records** (RRs).

A DNS record is structured as:

```
<NAME> <TTL> <CLASS> <TYPE> <DATA>
```

Example:
```
example.com. 86400 IN A 93.184.216.34
```

This line means that the domain `example.com` maps to the IPv4 address `93.184.216.34` and can be cached for 86,400 seconds.

DNS supports multiple record types, including:
- **A**: IPv4 address
- **AAAA**: IPv6 address
- **MX**: Mail exchanger
- **CNAME**: Canonical name (alias)
- **NS**: Name server for the domain
- **TXT**: Text strings (used for SPF, verification, etc.)

Unlike a typical SQL or NoSQL database, DNS is:
- **Federated**: Each domain is managed by its own authority.
- **Eventually consistent**: Due to caching, different resolvers may see different answers temporarily.
- **Flat and hierarchical**: Names are structured hierarchically, but the query mechanism uses recursion to flatten resolution.

---

## 💻 Lab 1.1 – Exploring DNS Records

Query basic record types using CLI tools.

### On Linux/macOS:
```
dig example.com A
dig example.com MX
dig example.com TXT
host example.com
```

### On Windows:
```
Resolve-DnsName example.com -Type A
Resolve-DnsName gmail.com -Type MX
```

### Questions:
- What are the TTL values?
- Are the results authoritative or recursive?
- What happens when a domain doesn’t exist?

---

## 1.2 DNS Structure

The DNS hierarchy is like a tree:

```
. (root)
├── com
│   └── example
│       └── www
```

The rightmost label is highest in the hierarchy. Fully Qualified Domain Names (FQDNs) end with a dot:
```
www.example.com.
```

Use the following to trace how a DNS resolver walks down this hierarchy:
```
dig +trace www.example.com
```

---

## 1.3 Zone Delegation

Zone delegation is the process by which DNS authority is transferred from a parent zone to a child zone. For example:
- `.com` is managed by Verisign.
- Verisign delegates `example.com` to nameservers controlled by the domain’s owner.

Delegation is accomplished with:
- **NS records** (list of authoritative servers)
- **Glue records** (A/AAAA records provided in the parent zone to resolve the nameserver names)

### Lab – Trace Delegation:
```
dig NS example.com
dig +trace example.com
```

---

## 1.4 The Root Zone

The root zone is at the top of the DNS hierarchy. It contains records for every Top-Level Domain (TLD), such as `.com`, `.org`, `.net`, etc.

There are 13 named **root servers** (A to M), operated globally using anycast. They respond to initial DNS queries and point to TLD nameservers.

Check root zone:
```
dig . NS
```

---

## 1.5 Authoritative DNS Servers

Authoritative servers are the ultimate source of truth for a zone. They:
- Host zone files
- Respond with actual DNS records
- Do not perform recursion

Types of authoritative servers:
- **Primary** (master): stores original zone file
- **Secondary** (slave): gets updates via AXFR/IXFR

### Lab – Querying Authoritative Servers:
```
dig @ns1.example.com example.com A
```

Use `+norecurse` to ensure recursion isn't performed.

---

## 1.6 Zone Transfer

Zone transfers replicate DNS data from primary to secondary servers.

- **AXFR**: full zone transfer
- **IXFR**: incremental transfer

Most modern DNS setups use TSIG to secure zone transfers.

### Lab – Try AXFR (if permitted):
```
dig @ns1.example.com example.com AXFR
```

⚠️ Many public nameservers disable AXFR to prevent zone data exposure.

---

## 1.7 Using `dig` and `nslookup`

### dig
The most powerful DNS troubleshooting tool. Use with flags:
```
dig example.com ANY
dig example.com MX +short
dig +trace example.com
```

### nslookup
Available on all OSes:
```
nslookup -type=TXT example.com
```

### PowerShell
```
Resolve-DnsName -Name openai.com -Type A
```

### Common dig flags:
- `+trace`: shows resolution path from root
- `+short`: simplifies output
- `+norecurse`: disables recursion
- `+dnssec`: includes DNSSEC data

---

## 🧠 Challenge: Full DNS Profile

Choose a high-profile domain (e.g., amazon.com). Using only DNS tools:
- Identify all record types (A, AAAA, MX, TXT, NS, CNAME)
- Trace the full resolution path
- Determine authoritative servers
- Check for DNSSEC support
- Examine TTL values

---

## 📘 Summary

By the end of this module, you should understand:
- The DNS hierarchy and record types
- How recursive and authoritative servers interact
- How to trace resolution paths
- How to inspect DNS data using command-line tools

Tools used:
- `dig`
- `nslookup`
- `host`
- `Resolve-DnsName`

Next: Dive into domain names, registrars, and WHOIS in Module 2.
