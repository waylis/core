# Introduction

Waylis is a Node.js package designed to simplify and speed up interaction between the user and your applications. It’s an all-in-one solution offering both a developer-friendly API and a user-friendly web UI.

![Promo](/promo.webp)

## Motivation

Traditional [client-server](https://en.wikipedia.org/wiki/Client–server_model) applications often require building a separate [frontend](https://en.wikipedia.org/wiki/Front-end_web_development): designing forms, input flows, and UI components just to collect, validate and display data. Waylis eliminates this extra work by offering a ready-to-use web interface where interaction happens throw predefined chat scenes. The user and your application communicate using simple messages, which can contain data of different formats: from plain text to entire files.

This approach makes it easy to prototype ideas, create demos, or even run production-ready services without writing a single line of frontend code.

## Use cases

The scope of Waylis is quite broad. You can use it to build entirely new applications from scratch, or integrate it into existing ones to provide a specific part of the functionality.

-   Desktop tools packaged into a [single executable file](https://nodejs.org/api/single-executable-applications.html).
-   Public online services (for example: converters, generators, calculators).
-   Internal systems for companies.
-   Demonstration setups for showcasing specific logic.
-   Utilities for personal use.
-   and more...

## Technical overview

At its core, Waylis runs as an HTTP server with its own built-in frontend and backend parts. In the backend, it uses a chat scene engine that lets users interact with the application just like a [chatbot](https://en.wikipedia.org/wiki/Chatbot).

The entire flow is based on message exchange between the user and your app:

-   Users start communication by sending predefined command messages that trigger a corresponding scene.

-   Each scene can define its own sequence of steps, where the user is asked questions to collect specific data.

-   Once all steps are completed, the scene handler is executed. At this point, the handler has access to all user-provided data and can run custom logic on it.

Waylis can use any database and file storage to store data. All you need to do is implement the appropriate interfaces.
