# Job-O(ffer) Scraper

## Description

The CLI mode would be capable of:
- Checking manually the new offers available form a given URL.
- Run in 'worker' mode, recurrently checking if a new offer is detected. Worker mode can be configured by passing the following parameters:
	- Multiples URLs
	- Filters: Location, keywords, job type, etc.

All job offers found would be stored locally, so they can be filtered and analyzed by 

## User stories

As a "CLI user"
I want to list manually all the new offers detected
so I can see all the new projects detected

As a "CLI user"
I want to automatically check all the new offer
so I can be notified when new projects are detected

As a "CLI user"
I want be notified when a new project is detected
so I can know when a new project is detected

As a "CLI user"
I want to filter the notifications I receive
so I can have what I want

## Versioning
v0.0.1 - CLI setup
v0.1.0 - CLI, Manual reading 
v0.1.1 - Multiple parsers
v0.2.0 - CLI, Worker mode
v0.3.0 - Email Notifications
v0.4.0 - Adding some graphs