# Module 5: Email and DNS

---

## 5.1 MX Records

**MX (Mail Exchange)** records tell mail servers where to deliver email for a domain.

An MX record includes:
- A preference (priority)
- A mail server (hostname)

Lower preference = higher priority.

### Example:
```
example.com. 3600 IN MX 10 mail.example.com.
```

### Lab:
```
dig gmail.com MX
```

Check:
- Hostnames of mail exchangers
- MX preference values

---

## 5.2 SPF (Sender Policy Framework)

**SPF** is a TXT record that lists the servers authorized to send mail on behalf of a domain.

Example:
```
"v=spf1 include:_spf.google.com ~all"
```

Meaning:
- Mail can be sent via Google’s servers
- `~all` = soft fail for others

SPF does not validate message content — it validates sender origin.

### Lab:
```
dig example.com TXT
```

Look for `v=spf1` string.

---

## 5.3 DKIM (DomainKeys Identified Mail)

**DKIM** uses cryptographic signatures to prove that an email’s content wasn’t altered.

- The sender signs outgoing emails with a private key.
- The public key is published in DNS as a TXT record.

### Query:
```
dig default._domainkey.example.com TXT
```

### Example value:
```
"v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3..."
```

Check headers of a received email for `DKIM-Signature:`.

---

## 5.4 DMARC (Domain-based Message Authentication, Reporting & Conformance)

**DMARC** builds on SPF and DKIM to define how unauthenticated emails should be handled.

Record format:
```
_dmarc.example.com. IN TXT "v=DMARC1; p=reject; rua=mailto:dmarc@example.com"
```

- `p=none | quarantine | reject`
- `rua=` = reporting URI
- `adkim` / `aspf` = alignment modes

### Lab:
```
dig _dmarc.example.com TXT
```

---

## 5.5 DANE (DNS-based Authentication of Named Entities)

**DANE** uses DNSSEC to bind TLS certificates to domain names using **TLSA records**.

Purpose:
- Prevent reliance on public CAs
- Enable SMTP STARTTLS validation

### Query:
```
dig _25._tcp.mail.example.com TLSA
```

Note: DANE is only trustworthy when DNSSEC is validated.

---

## 5.6 MTA-STS (Mail Transfer Agent Strict Transport Security)

**MTA-STS** enforces TLS for SMTP delivery.

Requirements:
- Policy file hosted at: `https://mta-sts.example.com/.well-known/mta-sts.txt`
- DNS TXT record:
```
_mta-sts.example.com. IN TXT "v=STSv1; id=20240401"
```

MTA-STS requires HTTPS to fetch policy and is supported by Gmail and others.

---

## 5.7 BIMI (Brand Indicators for Message Identification)

**BIMI** allows organizations to display brand logos in supported email clients.

Requires:
- Valid DMARC policy (`p=quarantine` or `p=reject`)
- A published SVG logo
- A DNS record:
```
default._bimi.example.com. IN TXT "v=BIMI1; l=https://example.com/logo.svg"
```

BIMI helps improve trust and brand recognition in the inbox.

---

## 💡 Challenge Exercise

For a domain of your choice:
1. Query all email-related DNS records (MX, SPF, DKIM, DMARC)
2. Analyze SPF policy components
3. Check DKIM selectors from email headers
4. Explore MTA-STS policy if available
5. Attempt to validate a BIMI logo URL

---

## 📘 Summary

This module explored how DNS supports secure and authenticated email delivery:

- **MX** routes mail to the right server
- **SPF** lists allowed sender IPs
- **DKIM** signs messages
- **DMARC** defines enforcement policies
- **DANE** and **MTA-STS** add TLS requirements
- **BIMI** connects email with brand trust

Tools used:
- `dig`
- `host`, `nslookup`
- Email headers
- Online testing portals (MXToolbox, Google Admin Toolbox)
