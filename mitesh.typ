#import "resume.typ": *

#let name = "Mitesh Shah"
#let email = "mitesh@miteshshah.com"
#let github = "oxalorg"
#let personal-site = "miteshshah.com"

#show: resume.with(
  top-margin: 0.45in,
  font: "New Computer Modern",
  personal-info-font-size: 9.2pt,
  author-position: center,
  personal-info-position: center,
  author-name: name,
  email: email,
  website: personal-site,
  github-username: github,
  linkedin-user-id: "mitesh-shah",
  mastodon: "fosstodon.org/@oxalorg"
)

#custom-title("Work")[
  #work-heading(
    "Technical Lead",
    "Gaiwan GmbH",
    "",
    2020,
    "Present"
  )[
    - Working with Clojure, ClojureScript, Postgresql, XTDB, Reagent, & re-frame for Gaiwan and its clients
    - Contributing to Lambda Island and all of its open source initiatives (eg: kaocha, ornament, reitit-jaatya etc)
    - Major project stretching over a year was with Pitch and Zoom where I helped integrate their entire product with the new Zoom apps, and worked on multiple features for Pitch. Managed to grok their entire 350k+ LOC codebase and worked with their entire stack. Code changes included frontend, backend, oauth, database, and infrastructure. Worked closely with Pitch's co-founder and Zoom's engineers
    - Actively mentoring juniors, pair-programming, and working with a team to distribute client work and ensure delivery of the right things in the right way
    - Helping clients adopt Clojure best practices, creating idiomatic testing setups, improving codebase while delivering business solutions
  ]

  #work-heading(
    "Open Source Funding",
    "Clojurists Together",
    "",
    2021,
    2022
  )[
    - Maintained the Clojurians Slack Log Archive for over a year (clojurians-log.clojureverse.org)
    - Started working on a v2 of Clojurians archive with improved features and performance, and got funded for 3 months by Clojurists Together to work on it
  ]

  #work-heading(
    "CTO / Co-Founder",
    "Taaza Kitchen Enterprises",
    "",
    2018,
    2020
  )[
    - Grew the company from 2 employees to over 15, from \$0 to \$150,000 ARR. Managed product, tech, sales, marketing, brand awareness, customer acquisition, and customer support
    - Developed a production-ready Django e-Commerce platform built from scratch. Managed a team to build the entire platform including Front End design, Database Design, Back end development, Automated Rolling Deployment Using AWS, Ansible, Terraform, & Packer. Also launched and promoted Android & iOS Apps
  ]

  #work-heading(
    "Technology Consultant",
    "Contract based",
    "",
    2015,
    2018
  )[
    - Working on in-house fintech products, creating MVPs to launch new B2C products
    - Creating product roadmaps, testing out ideas, building MVPs, researching about potential markets
    - Working with several clients to build and maintain their E-commerce products, SaaS products, and other bespoke solutions
    - Hands-on development with Python, Django, Wagtail, Postgresql, React, Webpack, React-Native
    - Automating with Infra-as-code using Terraform, Packer, Ansible, AWS. Setting up CI/CD
  ]
]

#custom-title("FOSS Projects")[
  #project-heading(
    "sakura",
    stack: "CSS",
    project-url: "https://github.com/oxalorg/sakura"
  )[
    - (Over 4,300 stars on GitHub) A drop-in CSS framework which works out of the box on your entire site without changing anything in existing HTML. Works directly on inbuilt HTML tags and is completely responsive. Supports duo-tone color customization
  ]

  #project-heading(
    "4ever-clojure",
    stack: "ClojureScript",
    project-url: "https://4clojure.oxal.org"
  )[
    - Pure ClojureScript version of 4clojure, meant to run forever. After 4clojure shut down, created the de-facto alternative. Uses sci - the small Clojure interpreter
  ]
]

#custom-title("Education & Activities")[
  #grid(
    columns: (1fr, 1fr),
    align(left)[*Mumbai University*],
    align(right)[*2013 -- 2017*],
    align(left)[B.E, Computer Engineering],
    align(right)[]
  )
  #v(-0.2em)
  #v(-0.4em)
  #set list(indent: 0.5em)
  - GPA: 8.03 out of 10.00
  - Developed an A.I. which uses human evolution and neural networks to learn and play games on its own. Simulations developed using Neuroevolution of augmenting topologies

  #skills()[
    - *YouTube:* Clojure, ClojureScript, & Emacs related programming videos (youtube.com/c/oxalorg)
    - *Blog:* oxal.org/blog/
    - *StackOverflow:* Ranked among the top 15% contributors overall
    - *Communities:* Active member in Clojurians, Clojureverse, and several others
  ]
]
