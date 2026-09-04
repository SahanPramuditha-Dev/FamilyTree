# Security Policy

## Supported Versions

FamilyTree is under active development. Security fixes are applied to the latest version on the default branch unless stated otherwise in a release.

## Reporting a Vulnerability

Please do **not** disclose security vulnerabilities in public issues, discussions, screenshots, or pull requests.

Use GitHub's private security advisory flow for this repository when available, or contact the maintainer privately through the contact information on the GitHub profile.

Please include:

- A description of the vulnerability and likely impact
- The affected page, component, or data flow
- Safe reproduction steps
- Relevant logs or screenshots with personal information removed
- A suggested mitigation, if known

Do not access, modify, download, or retain family records that you are not authorized to view while testing a report.

## Security-Sensitive Areas

FamilyTree handles private genealogy and family information. Particular care should be taken around:

- Authentication and session handling
- Firestore security rules
- Family and relationship records
- Photos and document access
- Collaboration roles and permissions
- Imports and exports such as GEDCOM, CSV, JSON, PDF, and images
