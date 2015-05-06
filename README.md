# Schedule Picker for Meteor

Allow users to pick a schedule for their recurring tasks.

This package is currently single-use, we use it internally and don't really expect other developers to use it. If you'd like to use the package in your app you'll probably need to make some changes to make it more customizable - we're open to pull requests.

# Usage

Include the schedule picker template into your app: `{{> schedulePicker name="schedule" options=options}}`

The template includes several select elements and 2 hidden inputs which you can style to your own needs.

Once a user selects the options they want you can capture the relevent information from the two hidden inputs:

`name="{{name}}.value"` - should contain a JSON object representing a laterjs style schedule
`name="{{name}}.selection"` - should contain a JSON array of the options selected, e.g. `["schedule","daily","twice","twice"]`.
