# Durable findings destination

Canonical user-selected archive path: **Google Drive / macbook / Scavenger / Veloren / Veloren — Engineering Findings Ledger**.

Verified folder IDs (Google Drive):
- macbook: `1VDYOL_gqsL_ou4MFpmkCYMgvsONfcdHO`
- Scavenger: `1JDC9wTYBRiG1hOe1xVXTSETLRyxezirW`
- Veloren: `1XiFfXUPNO8RZR2ou4cTlKFMJNdIViI_H`
- Ledger Google Doc: `1JnRlzwBkkYP6lFu7-phdc_twcV74GbkCDWK_qf1HdYg`

[Open findings ledger](https://docs.google.com/document/d/1JnRlzwBkkYP6lFu7-phdc_twcV74GbkCDWK_qf1HdYg/edit)

## Mandatory workflow
1. Perform source inspection and reproducible tests in the GitHub repository.
2. Create a dated, source-linked finding in `specimens/<id>/` or `patterns/`.
3. Verify the GitHub commit, tests, and evidence state.
4. Append the finding to the specimen's dedicated Google Drive ledger, including GitHub permalink and source SHA.
5. Read back the Drive record and verify the destination parent.
6. Report GitHub and Drive states separately; if either fails, mark `SYNC PENDING` and preserve the source artifact for retry.

**Do not claim automatic Drive synchronization.** The current GitHub Actions workflow has no Drive credentials and does not write to Google Drive. A connected ChatGPT session can perform the append and readback when authorized; a future unattended sync requires separately authorized credentials and testing.

For specimen 002+, create a separate `Scavenger/<specimen-name>/` folder and dedicated ledger. Never combine unrelated specimen findings in Veloren's ledger.

Avoid duplicating private data into the public GitHub repository. Do not put OAuth tokens or Drive secrets in GitHub.
