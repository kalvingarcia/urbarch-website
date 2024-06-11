# urbarch-website

This project is the official codebase for the Urban Archaeology website. The website I implemented suceeds the company's previous website. When I inherited the position of Web Developer at Urban, the website looked like it was potentially created in Dreamweaver (or a similar website building platform). This is because the website had clear patterns and comments that suggested a program was likely looking for tags when editing the code, but the person in the position before me was editing the HTML documents directly, so even if I managed to find what platform was used to create the website, I likely wouldn't have been able to use it for updates. Because the old website was designed and built in the late-2000s, it definitely needed some modernization. I decided to design and build the website from the ground up.

### The Stack

For this project, I used a variety of technologies, but the most important for the functionality of the website are Next.js (and therefore React.js), Cockroach Lab's Database Cluster (PostgresQL), and Sass (specifically SCSS).

### Next.js

I've developed using many different React.js frameworks, such as Gatsby and Create React App, but none have come as eaasily to me as Next.js. I've developed a few toy websites to learn the concepts of the framework, and I thoroughly enjoy using it. Despite that, this website needed some API endpoints to access the database, and Next.js has route endpoints that allow for easy integration in that front. The added benefit of the latest server component structure and app routing, means the application was be made with a few features I had in mind built in, like URL search queries.

#### CockroachDB

This is only my second time using this tech, but the free (scaling tier meant that I could develop the project without breaking bank for myself or the company. It also means that since the company's website isn't very high traffic, the database can stay on the cluster for now, saving some money. The added benefit being that the cluster is hosted using Google Cloud Services. PostgresQL itself offers a variety of enhanced features on top of SQL that makes adding indexing and full text search more simple.

#### Sass

While I wanted the stack to be only JavaScript to keep the process of linking and coding simple, there is very little JSS support for Next.js's App Router. I specifically enjoy using JS-in-CSS, which is simple and doesn't have unnecessary code that I wasn't planning to use. I also found that other JSS libraries all ran into the same issues: the initial generated CSS styles don't get updated for server components leading to a lot of conflicts. I decided to just use SCSS which would let me compile down a mixin for themed dark and light modes.

### Potential Features

I decided that a history page was relatively low on the priority list.

### Some Hurdles

## License
Copyright of Urban Archaeology and Kalvin Garcia. All rights reserved. This is proprietary code created for Urban Archaeology. Unauthorized copying of these files, via any medium is strictly prohibited. Implemented and deployed by Kalvin Garcia.

## Contact

## Acknowledgements







