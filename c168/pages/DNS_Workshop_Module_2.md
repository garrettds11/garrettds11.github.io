# Module 2: Domain Names

---

## 2.1 TLDs and ccTLDs

**Top-Level Domains (TLDs)** are the highest level in the DNS hierarchy. They fall into categories:
- **gTLDs** (generic): `.com`, `.org`, `.net`, `.info`
- **ccTLDs** (country-code): `.us`, `.de`, `.uk`, `.jp`

ICANN delegates TLDs to registries. For example:
- `.com` → managed by Verisign
- `.uk` → managed by Nominet

### Labs:
- Identify the TLD for your organization's domain.
- Search ICANN's [TLD list](https://data.iana.org/TLD/tlds-alpha-by-domain.txt)

---

## 2.2 Domain Hierarchy

DNS names are structured **right to left**:
```
www.sales.example.com.
└── subdomain
    └── second-level domain (SLD)
        └── top-level domain (TLD)
            └── root (.)
```

The **Fully Qualified Domain Name (FQDN)** ends with a dot (`.`) and includes every label from the subdomain to the root.

### Lab:
Use `dig +trace` to explore resolution levels:
```
dig +trace www.example.com
```

Observe:
- Root server
- TLD server
- Authoritative domain server

---

## 2.3 Registries vs Registrars

- A **registry** manages a specific TLD (e.g., Verisign for `.com`)
- A **registrar** is a company that sells domain names (e.g., GoDaddy, Namecheap)

Registrars interface with end-users, while registries maintain authoritative zone files.

### Real-world flow:
1. User registers `example.com` with Namecheap
2. Namecheap sends data to Verisign (the `.com` registry)
3. Verisign updates its nameservers with `NS` records for `example.com`

### Exercise:
Look up who manages a domain:
```
whois example.com
```

---

## 2.4 ICANN Oversight

**ICANN** (Internet Corporation for Assigned Names and Numbers):
- Oversees global domain name policies
- Coordinates IP address allocation via IANA
- Accredits registrars
- Manages the DNS root

ICANN ensures fair domain assignment and resolves registry/registrar disputes.

📝 Fact:
ICANN operates the root DNS server cluster with partners and maintains root zone integrity.

---

## 2.5 WHOIS and RDAP

WHOIS and RDAP expose domain registration data:
- Registrar name
- Creation & expiration dates
- Registrant (sometimes redacted)
- DNS servers

### Tools:
```
whois example.com
```
or visit:
- https://who.is
- https://lookup.icann.org

**RDAP** (Registration Data Access Protocol) is the modern JSON-based alternative to WHOIS:
```
https://rdap.org/domain/example.com
```

---

## 2.6 Internationalized Domain Names (IDNs)

**IDNs** support non-ASCII characters (e.g., Arabic, Chinese, accented Latin characters).

Under the hood, they’re encoded using **Punycode**:
```
café.com → xn--caf-dma.com
```

Check via:
```
dig xn--caf-dma.com
```

📝 Use `idn` tool or browser bar to test conversion.

---

## 2.7 Domain Lifecycle

Domains go through these phases:

| Phase            | Description                                   |
|------------------|-----------------------------------------------|
| Active           | Domain is in use                              |
| Expired          | Owner missed renewal                          |
| Grace Period     | Renewable without extra cost (~30 days)       |
| Redemption       | Recoverable with penalty (~30 days)           |
| Pending Delete   | About to be purged (~5 days)                  |
| Available        | Back on the market                            |

Domains can be **backordered** during the redemption phase using aftermarket services.

---

## 2.8 Domain Transfer

To move a domain between registrars, you must:
1. Unlock domain
2. Obtain **EPP/Auth code**
3. Submit transfer request to the new registrar
4. Confirm via email (usually to registrant contact)

### Transfer considerations:
- Domains can’t transfer within 60 days of registration or prior transfer
- WHOIS privacy must not block transfer emails

### Example:
```
Get Auth Code → Submit to New Registrar → Confirm Transfer
```

---

## 💡 Challenge Exercise

Choose 3 domains and:
- Identify their TLD category (gTLD or ccTLD)
- Determine their registrar and registry
- Check WHOIS and RDAP details
- If an IDN, decode its Punycode

---

## 📘 Summary

This module covered:
- TLD categories and governance
- Hierarchy and structure of DNS names
- Registry/registrar relationships
- ICANN's role in global DNS management
- Domain data protocols: WHOIS and RDAP
- Lifecycle and transfer mechanics

Tools used:
- `whois`
- `dig`
- `idn`
- ICANN lookup portals
