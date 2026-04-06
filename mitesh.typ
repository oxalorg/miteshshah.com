#import "resume.typ": *

#let name = "Mitesh Shah (@oxalorg)"
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
    - Worked as tech  & product lead for several fast paced startups and enterprise clients.
    - *Zoom and it's child company Pitch*: Building out the oAuth integrations for their zoom apps platform, worked on a massive 350k+ LOC codebase. Worked closely with Pitch's co-founder and Zoom's engineers
    - *Humble AI*: Created their entire product line of AI workflow execution engine (like n8n). Scaled it to over 100,000+ workflows and over *40M workflow executions*.
    - *OpenTech.eco*: Built data pipelines and dashboards for their product GRID which sources energy data from buildings deployed across major cities in Canada and North America. The scale of this was importing data coming from over 1,000,000+ properties. I helped speed up this ETL process from 1.5 hours down to 8 minutes.
	- *ITRevolution*: I tightly collaborated with *Gene Kim*, the author of The Phoenix Project,  to build an entire product line for them. We created a Bespoke video editing and rendering tool to allow editing of conference videos via the browser. Created a live streaming conference platform handling 1000s of concurrent users. I lead the development of all of these products from planning to delivery. I also got mentioned in his latest book *Vibe Coding* with Steve Yegge as I helped introduce Gene to AI/Agentic workflows.
  ]

  #work-heading(
    "Open Source Funding",
    "Clojurists Together",
    "",
    2021,
    2022
  )[
    - Got funded by ClojuristsTogether.org to work on enhancing Clojurians Slack Log (clojurians-log.clojureverse.org) which I have been maintining for multiple years.
  ]

  #work-heading(
    "CTO / Co-Founder",
    "Taaza Kitchen Enterprises",
    "",
    2018,
    2020
  )[
    - Grew the company from 2 employees to over 15, from \$0 to \$150,000 ARR. Managed product, tech, sales, marketing, brand awareness, customer acquisition for 20,000+ customers 
    - Developed a production-ready Django e-Commerce platform built from scratch handling over 20,000 customers with intrictate rules based engine and automations for marketing. Also built Android apps for warehouse packers with rack optimisation algorithms, and an app for delivery boys solving route optimisation.
  ]

  #work-heading(
    "Technology Consultant",
    "Contract based",
    "",
    2015,
    2018
  )[
    - Working with several clients to build and maintain their E-commerce products, SaaS products, and other bespoke solutions
    - Hands-on development with Python, Django, Flask, Postgresql, React, React-Native. Automating with Infra-as-code using Terraform, Packer, Ansible, Fully automated CI/CD using Blue-Green deployments on AWS.
  ]
]

#custom-title("FOSS Projects")[
  #project-heading(
    "sakura.css",
    [(4,300+ stars on GitHub) A drop-in CSS framework which works with semantic html tags. Arguably one of the first projects to introduce this concept.],
    project-url: "https://github.com/oxalorg/sakura"
  )

  #project-heading(
    "4ever-clojure",
    [(256+ stars on GitHub) Clojure exercies in the browser. After 4clojure shut down, created the de-facto alternative. Uses sci - the small Clojure interpreter],
    project-url: "https://4clojure.oxal.org"
  )

  #project-heading(
    "10xdev",
    [A monorepo for my personal hacking, from implementing research papers, to learning Erlang OTP, to image recognition on the rpi+hailo chip, to experimenting with dbus, everything is committed here.],
    project-url: "https://codeberg.org/oxalorg/10xdev"
  )

  #project-heading(
    "homelab",
    [I self host 15+ services on my home server, including a local llm, and run a cluster of 7 different devices on the tailscale network]
  )
]

#custom-title("Education & Activities")[
  #education-heading("Mumbai University", "", "B.E", "Computer Engineering", 2013, 2017)[
  - GPA: 8.03 out of 10.00
  - Developed an A.I. which uses human evolution and neural networks to learn and play games on its own. Simulations developed using Neuroevolution of augmenting topologies
  - *YouTube:* Clojure, ClojureScript, & Emacs related programming videos (#link("https://youtube.com/c/oxalorg")[youtube.com/c/oxalorg])
  - *Blog:* #link("https://oxal.org/blog/")[oxal.org/blog/]
  - *StackOverflow:* Ranked among the top 15% contributors overall
  ]
]
