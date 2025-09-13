# Introduction

Waylis is a Node.js package designed to simplify and speed up interaction between the user and your application. It’s an all-in-one solution offering both a developer-friendly API and a user-friendly web UI.

Traditional applications often require building a separate frontend: designing forms, input flows, and UI components just to collect and validate data. Waylis eliminates this extra work by offering a ready-to-use web interface where interaction happens through dialogues. Instead of coding repetitive frontend logic, you simply define conversational blocks that describe how the user and the application should communicate.

This approach makes it easy to prototype ideas, create demos, or even run production-ready services without writing a single line of frontend code. Waylis is lightweight, with no heavy dependencies, and uses only the standard Node.js library for its core and HTTP server. A built-in minimalistic web UI with responsive layout and themes is included out of the box.

## How it works?

At its core, Waylis runs as an HTTP server with its own built-in frontend and backend parts. Inside the backend, it uses a chat scene engine that allows the application to interact with users just like a chatbot.

The entire flow is based on message exchange between the user and your app:

-   Users start communication by sending predefined command messages that trigger a scene.

-   Each scene can define its own sequence of steps, where the user is asked questions to collect specific data.

-   Once all steps are completed, the scene handler is executed. At this point, the handler has access to all user-provided data and can run custom logic on it.
