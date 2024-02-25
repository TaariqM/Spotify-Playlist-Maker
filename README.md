# Spotify Playlists Generator

## Table of Contents
* [Introduction](#introduction)
* [Features](#features)
* [API Endpoints](#api-endpoints)
* [Limitations](#limitations)
* [Technologies Used](#technologies-used)
	* [Frontend](#frontend)
	* [Deployment](#deployment)

## Introduction
Spotify Playlists Generator is a web application that produces different playlists based off of the different genres of songs contained in a Spotify users 'Liked Songs'. This application provides Spotify Users an easy way to categorize the music in their 'Liked Songs', as well as a view of the different types of genres that they may not know they listened to. With this, music lovers can continue to learn and explore genres of music that they may not have heard of, but for those that may not be well versed in music, it can act as a gateway to exploring new music.

## Features
* Users can sign in to their Spotify accounts
* Users can generate different playlists
* Users can select any of the different playlists
* Users can view the songs contained within a playlist
* Users can play the individual songs within a playlist

## API Endpoints
This web application utilizes Spotify's Web API. This API allows this web application to interact with Spotify's streaming services, at this base URL: ```https://api.spotify.com/v1```. For further information, please refer to their [documentation](https://developer.spotify.com/documentation/web-api) 

Below are the specific API endpoints that were used for this web application are.

| HTTP Request Method | Endpoints | Action | Optional Parameters |
| --- | --- | --- | --- |
| GET | /me/player/devices | returns a Spotify users connected devices | N/A |
| GET | /tracks/{id} | returns Spotify's information about a single song, identified by its unique ```id``` | N/A |
| GET | /me/player | returns the users current playback state, which includes the current progress of a song or episode, and the id of the current device | N/A |
| PUT | /me/player/pause | pauses playback on a users account | ```device_id``` - provided in the command if pausing the playback on a specific device |
| PUT | /me/player/play | starts or resumes playback on a users account | ```device_id``` - provided in the command if starting or resuming the playback on a specific device |
| GET | /me/tracks | returns a list of songs saved in the current Spotify user's 'Liked Songs' | ```limit``` - provided in the command if returning a maximum number in the list |
| GET | /artists/{id} | returns Spotify's information about a single artist, identified by their unique ```id``` | N/A |

## Limitations
* Users must have the Spotify Application open on their device if they want to play a song in a playlist. This is due to this web application not using the Spotify Web Playback SDK
	*  Please play any song from the Spotify app on your device first. This will allow the web application to recognize the device
* Can only create playlists based off of the first 50 songs within a Spotify users 'Liked Songs'. This is due to 50 being the maximum amount
* Only users with Spotify Premium will be able to play songs
* Only users with Spotify Premium will be able to pause songs

## Technologies Used 

### Frontend 
* React
* Vite
* TypeScript
* HTML 
* CSS 

### Deployment
* Firebase