# Improvement
* On the main page, where all of the shelfs are displayed, there was a flaw in the way all of the shelfs and the shelf items were fetched from the backend. <br />
Original implementation fetched all of the shelfs from the backend and then fetched items for each shelf. <br />
This caused the screen and the listings to flicker. <br />

* The new modification was that the backend now contains a single api endpoint, to retrieve all shelfs and each shelfs items in a {shelfName: [items]} object.<br />
Now the screen won't flicker anymore on load.