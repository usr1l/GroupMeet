# GroupMeet
GroupMeet is the go-to place for people looking to meet new people, or engage with their community. Whether you're looking to connect with others, join a group of interest, or attend an event, GroupMeet provides it all.

Your next great adventure is just a click away.

Register today: https://aa-meetup-api-project.onrender.com/

GitHub Repo: https://github.com/usr1l/project1

## Technologies Used

### Languages

- JavaScript
- HTML
- CSS
- DBML

### Frameworks
- React
- Express

### Libraries
- Redux

### Databases
- SQLite3
- PostgreSQL

### Tools
- Postman
- GitHub
- Visual Studio Code


## Features
### Groups
Create, edit or delete a group that you are hosting.

View all groups.

![This is an image](../../README/assets/groups1.png)

![This is an image](../../README/assets/groups2.png)
### Events
Create, edit or delete events your group is hosting.

View all events.

![This is an image](../../README/assets/events1.png)

![This is an image](../../README/assets/events2.png)
## React Components

- Button
- ErrorPage
- Events Pages
- Features Bar
- Groups Pages
- Homepage
- Icon Description Card
- Icon Label
- Image Preview
- Input Div
- Login Form
- Navigation Bar
- Open Modal Button
- Preview Card
- Signup Form Modal
- Splash Page

## Database Schema

![This is an image](../../README/assets/meetup_dbdiagram.png)

## Frontend Routes

- /groups
- /events
- /groups/new
- /events/new
- /groups/:groupid
- /events/:eventId
- /groups/:groupid/edit
- /events/:eventId/edit

## API Routes

[Link to API Routes](../../README/assets/API-docs-Meetup.md)

## Redux Store Tree
```
store = {
  session: {},
  groups: {
    allGroups: {
      [groupId]: {
        groupData,
      },
      optionalOrderedList: [],
    },
    singleGroup: {
      groupData,
      GroupImages: [imagesData],
      Organizer: {
        organizerData,
      },
      Venues: [venuesData],
    },
  },
  events: {
    allEvents: {
      [eventId]: {
        eventData,
        Group: {
          groupData,
        },
        Venue: {
          venueData,
        },
      },
    },
    singleEvent: {
      eventData,
      Group: {
        groupData,
      },
      // Note that venue here will have more information than venue did in the all events slice. (Refer API Docs for more info)
      Venue: {
        venueData,
      },
      EventImages: [imagesData],
      // To be completed
      Members: [membersData],
      Attendees: [attendeeData],
    },
  },
};

```

## To-Do's
- Venue creation for events.
- Membership and Attendance status and update.
- Sort events by groups.
- Search feature.
- Upload image files.
- User profile page.


## Other Files and Links
- [Link to Kanban cards](../../README/assets/Kanban-cards-Meetup.md)
