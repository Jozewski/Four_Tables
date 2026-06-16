# Screen Reader QA

## Purpose

This document records the manual screen-reader accessibility pass completed for Four Tables during the WCAG accessibility sprint.

## Test Method

Manual screen-reader and keyboard review was performed against the local application.

Focus areas:

- meaningful announcements for headings, links, and buttons
- form label clarity
- logical tab order
- modal usability
- contributor access flow
- archive and logout controls

## Flows Tested

- Home page
- Recipes index
- Contributor access page
- Header theme toggle
- Header `Log Out` control
- Add Recipe modal
- Archive confirmation flow

## Results

Manual testing confirmed the following:

- interactive controls were reachable by keyboard
- control labels were understandable
- page structure behaved as expected during navigation
- contributor flow was usable
- add-recipe modal flow was usable
- logout flow was usable
- no blocking screen-reader issues were found during this pass

## Notes

- The redundant `Log Out` control inside the contributor access card was removed after manual review.
- The header `Log Out` pill remains the single visible sign-out control.

## Follow-Up

Before deploy, repeat a short smoke test against the live Vercel URL to confirm:

- deployed heading structure is intact
- modal flow remains accessible
- contributor access flow remains accessible
- no regression was introduced during deployment setup
