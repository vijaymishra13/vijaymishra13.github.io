## Introduction
In this Narrative visualization, a hypothetical network link outage is demonstrated along with its resolution. Because of unavailability of appropriate data in public domain, data in this project is mocked to represent a fictional network having an outage.

Martini glass narrative structure is used for this project to walk user through network view over a time period as various elements of the network starts alarming, one of the network link goes down and eventually all issues are resolved. First chart plotted on time scale shows overview of various faults reported in the network along with remedial actions performed on the network. Second chart shows the network view plotted on geographic map showing status of various devices as well as link connecting them. A set of tabs were used to navigate through snapshot view of network at different moment in time annotated with high level status of network. Last tab allows user to explore status of network using slider on the timeline. User can also zoom in and out the map, though no additional information is made available on zoom-in at this moment.

An event timeline on top of the page is used to keep user oriented on flow of scenes. For the network view, a familiar geographic map is used as the scene showing various network elements based on their geographic location. As the user navigates through various tabs, backdrop of geographic map stays same while different elements are updated based on their status. A marker on overview timeline is also updated to show their relative position on the timeline of events. Color of the elements is used to highlight devices and links that require attention. The timeline on the top with a marker indicates to the user that what they are viewing is a snapshot of network at a given time.

## Running locally
This code and be run locally by using any http server. I used https://www.npmjs.com/package/http-server to test it locally.

## Key source files

| Name      | Purpose     | 
|-----------|-------------|
|index.html | HTML file to put all of it together |
|index.js   | Javascript file with some common functions |
|index.css  | stylesheet  |
|heat-map.js| Javascript which plota the map with various elements on it|
|fault-timeline.js|Javascript that plots timeline on top of the page |
|canadaprovjson| directory containing topology information about Canada |
|ofice-info.csv| Data file containing office information along with their lat/long info|
|devices.csv| Data file containing devices information and their state at various moment in time|
|links.csv  | Data file containing links between devices and it's state at various moment in time |
|syslog-fault.csv| Data file with syslog fault and time it occurred |
|changes.csv| Maintenance/Correction activities carried out with start and end time |
|annotations.csv| annotations to show on the map |

In this example, data is sources from local csv file. However, in real life, data will most likely be sources from some timeseries database.
