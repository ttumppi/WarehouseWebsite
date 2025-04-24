# Warehouse website : Management of inventory
## Overview
This project had a goal of making a simple website to manage shelfs and and items in the shelfs. <br />
The project had 5 main functionalities to implement. <br /> The project is aimed to help represent physical objects such as shelfs and items and shelf location.

## Use cases

| Case | Implemented (yes / no) | notes |
| :--- | :--- | :--- |
| 1 . User wants to add a new shelf | yes | Original plan had implemented a mass-shelf creation page, but this was changed to a single button and ability to alter shelf information after creation due to time constraints. |
| 2 . User wants to create a new item | yes | Done as planned |
| 3 . User wants to change item balance or location | yes | Done as planned | 
| 4 . User wants to change shelf space | yes | done as planned |
| 5 . User can search items by manufacturer, model or serial | yes | done without the ability to search by shelf location, as this is redundant |

### Notes
One of the key functionality of the planned system was a popup-style dialogues being shown to user on different pages, but this was dropped due to the project time structure and planned course schedule.

## Technologies

During the course, the course assignments have used node express and react as one of the core frameworks, and these are what this project uses aswell.<br />
Database is done with postgresql as this was a course criteria. <br />

General coding practices have been something alongside MVC without models, to try to keep a clean and simple hierarchy between core components.

## Development

In the start of the project, it was decided to be the best course of action to prepare the vm with a self-hosted github runner that would pull the code from the repository on every push, to eliminate the need to manually pull every update to the machine. <br />

As mentioned before, the popup-style dialogues were dropped pretty early on the development of the website. <br />

Some libraries were additionally installed missing from the original plan, that made development faster and easier. <br />

The project had kind of a late start, but got back on track after a small crunch.

## After thoughts

The project was nice practice with react, as the developer had never used this before. <br />
Also the self-hosted github runner was a new component to setup and made development faster and easier.
<br />

The website would need a pretty big facelift, as the functionality came before the prettyness in terms of schedule. <br />

The website has all of the planned functionalities that had initially been planned.

The backend api is not role protected, which could cause problems if someone were to really try to mess things up.

## Work hours


| Date  | Used hours | Subject(s) |  outcome |
| :---  |     :---:      |     :---:      |     :---:      |
| 28.3.2025  | 2 | Planning the phase 1  | Defined roles, functionality  |
| 30.3.2025  | 4 | Planning the phase 1  | Defined database, technologies, user testing and UI  |
| 01.04.2025 | 2 | AWS VM | Fixed AWS VM access with ssh |
| 04.04.2025 | 2,6 | Github | Setting up github actions |
| 07.04.2025 | 4   | Dev backend | Developing backend basic functions |
| 09.04.2025 | 4   | unit test setup and vm troubleshooting | npm causing problems, initial unit testing environment set |
| 12.04.2025 | 8   | Created backend functionalities for shelfs and items |
| 13.04.2025 | 11   | Finished backend database functionalities| Added frontend login page | 
| 14.04.2025 | 9    | Added homepage with get post delete for shelfs | UI has been progressed, and website uses tokens | 
| 15.04.2025 | 14  | Frontend | Made additional functionality available on the frontend, item list, item creation, adding item to shelf and deleting item from shelf and item transfer and item balance change |
| 16.04.2025 | 13 | Frontend | Added user level and user creation and did a search function |
| 17.04.2025 | 4 | documentation | Added 2nd phase documentation |
| 23.04.2025 | 3 | Improvement | Sped up main page shelf data retrieval |

# Video link
