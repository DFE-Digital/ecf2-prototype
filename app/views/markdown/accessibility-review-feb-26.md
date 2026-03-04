# Internal accessibility review: February 2026

The service has been designed and built with accessibility in mind, using appropriate design patterns and WCAG best practice implementation.

To minimise accessibility issues and enable the drafting of an accessibility statement, we've carried out technical accessibility testing to confirm semantically correct markup across the service.

To consider potential usability issues, we've also reviewed user journeys with assistive technology to assess real world usability for users with access needs. 

## Approach

We tested compliance against WCAG standards and best practice using automated scans, including the axe DevTools extension.

We also carried out manual usability testing across key user journeys using assistive technology. This included keyboard-only navigation and VoiceOver, the screen reader built into macOS.

Although this covers some of the tools used by people with accessibility requirements, it does not cover the full range of assistive technologies. As a result, some issues may not have been identified in this round of testing.

## User journeys tested

The user journeys tested in this review were:

- Registering a new ECT (early career teacher)
- Assigning a new mentor to an ECT
- Updating ECT details
- Updating mentor details
- Reporting that an ECT is leaving the school permanently
- Updating SIT (school induction tutor) details

This does not include every journey in the service. Niche, edge case and less common journeys were out of scope, so some issues may not have been identified in this review.

## Automated scans - issues

### Inconsistent `Error:` prefix in page titles during change ECT / mentor / SIT details journeys

When changing details for an ECT, mentor or SIT, the page title does not consistently include the `Error:` prefix when a validation error is shown. In some journeys the prefix is present, but in others it is missing.

This can make it less clear to screen reader users that the page has reloaded with errors.

This issue could be:

- a failure of WCAG Success Criterion 2.4.2 (Page Titled), where the page title does not consistently communicate the page state
- a failure of WCAG Success Criterion 3.3.1 (Error Identification), where errors are not identified consistently across comparable journeys

The `Error:` prefix should be applied consistently to page titles whenever validation errors are present in ECT and mentor change journeys.

### Heading levels used incorrectly

Using heading levels correctly is best practice, rather than an explicit failure of a WCAG success criterion. However, incorrect heading levels can still make pages harder to navigate for screen reader users who rely on headings to build a mental map of content.

We identified the following issues:

- The heading in the summary card pattern on the 'list of ECTs' and 'list of mentors' pages is marked up as `<h3>` instead of `<h2>`.
- On the 'Find an ECT' page, the date of birth field is marked up as `<h3>`. The TRN field on the same page uses a `<label>`, so the date of birth field should follow the same pattern. Alternatively, both could be marked up as `<h2>`.
- On the 'Start date' page for registering an ECT, there is a visually hidden `<h3>` inside `<fieldset><legend>`. This could potentially be a `<label>`, otherwise it should be changed to `<h2>`.
- On the 'You've assigned (mentor) as a mentor for (ECT)' page, the 'What happens next' subheading is marked up as a `<h3>` instead of `<h2>`.

### Unsupported ARIA attributes on radios with conditional reveals

This is a failure of WCAG Success Criterion 4.1.2: Name, Role, Value.

We identified a failure for the rule "Elements must only use supported ARIA attributes", where an element's role does not support one of its ARIA attributes.

Affected element:

- Element ID: `#review-ect-details-change-name-yes-field` & `#review-mentor-details-change-name-no-field`
- Pattern: GOV.UK radios with conditional reveal content

```html
<input id="review-ect-details-change-name-yes-field" class="govuk-radios__input" type="radio" value="yes" name="review_ect_details[change_name]" aria-controls="review-ect-details-change-name-yes-conditional" aria-expanded="false">
```

```html
<input id="review-mentor-details-change-name-no-field" class="govuk-radios__input" type="radio" value="no" name="review_mentor_details[change_name]" aria-controls="review-mentor-details-change-name-no-conditional" aria-expanded="false">
```

This is a known issue in GOV.UK Frontend's radios component for conditional reveals. The issue is tracked at [alphagov/govuk-frontend#979](https://github.com/alphagov/govuk-frontend/issues/979), and GOV.UK Design System guidance also flags this as a known issue: [Conditionally revealing content - Known issues](https://design-system.service.gov.uk/components/radios/#known-issues-and-accessibility-considerations).

Although this may be technically resolved by removing the unsupported `aria-expanded` attribute from the radio input, we can choose not to make a customised change to the design system pattern. As set out in a [GOV.UK accessibility update on conditionally revealed questions](https://accessibility.blog.gov.uk/2021/09/21/an-update-on-the-accessibility-of-conditionally-revealed-questions/), GOV.UK are continuing to review the evidence and approach.

We can log this as a known issue, monitor further GOV.UK and GOV.UK Design System updates, and include it in our accessibility statement in line with the GOV.UK approach.

## Manual usability testing - issues

### ECT not being read out correctly by screen reader

We use `ECT` as an initialism (rather than an acronym), VoiceOver reads it out as a single word (for example, "ekt") instead of reading each letter individually.

We should investigate whether this can be improved through accessible naming (for example, by using an `aria-label`).

This may be specific to VoiceOver, as some other screen readers may read all caps text as an initialism.

### Summary card lists

This is an issue we've already identified with our usage of the GOV.UK summary card pattern.

The component currently uses multiple lists within each summary card, rather than a single list structure. This can make the content harder to follow for screen reader users, as navigation moves through several separate lists for different fields.

A ticket to fix this issue has already been raised in [ticket #1424](https://github.com/DFE-Digital/register-early-career-teachers-public/issues/1424).

### Enter email address label repeating the body text

When entering an email address while registering ECT details, the input label repeats the body text shown above the field.

This creates unnecessary duplication for screen reader users. The field label should be simplified to `Email address`.

This is correctly implemented when entering an email address while registering mentor details.