// All hardcoded content for AveelashGPT

export const candidate = {
  name: "Aveelash Hota",
  role: "Junior DevOps Engineer / Junior SRE",
  email: "aveelash.hota04@gmail.com",
  github: "https://github.com/aveelash",
  githubHandle: "github.com/aveelash",
  linkedin: "https://www.linkedin.com/in/aveelash-hota-442317338",
  linkedinHandle: "linkedin.com/in/aveelash-hota-442317338",
};

export const readme = `# Aveelash Hota
Junior DevOps Engineer | AWS | Kubernetes | Terraform | CI/CD

Available for:
• Junior DevOps Engineer
• Junior SRE
• Platform Engineering Intern

Building cloud-native infrastructure, deployment automation,
monitoring platforms, and production-style DevOps workflows.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## What I Do

• Infrastructure as Code with Terraform
• Containerization with Docker
• Kubernetes Deployments
• CI/CD Automation with GitHub Actions
• Monitoring & Observability
• Linux Administration & Troubleshooting

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Featured Projects

→ End-to-End DevSecOps Pipeline
→ Production-Ready Container Platform
→ Monitoring & Observability Stack
→ Kubernetes Deployment Platform
→ Terraform AWS Infrastructure

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Quick Commands

/recruiter
/resume
/projects
/skills
/github
/impact
/contact

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Additional Information

→ AWS Cloud Foundations Certified
→ DevOps Internship Experience
→ Hands-on Kubernetes & Terraform Projects

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Focused on building reliable, scalable, and automated
systems while continuously improving cloud, Kubernetes,
and Site Reliability Engineering skills.`;

export const summary = `# Executive Summary

Project-driven Junior DevOps Engineer with hands-on experience building CI/CD pipelines, cloud infrastructure, containerized applications, Kubernetes deployments, Infrastructure as Code, and monitoring platforms through personal projects and internship experience.

Core strengths:

• Docker containerization
• Kubernetes deployments
• CI/CD with GitHub Actions
• AWS & Infrastructure as Code (Terraform)
• Monitoring with Prometheus & Grafana
• Linux administration and troubleshooting

Key Achievements:

✓ Built an end-to-end DevSecOps pipeline using GitHub Actions,
  Terraform, AWS, Docker, and Kubernetes

✓ Automated application deployment workflows and infrastructure provisioning

✓ Provisioned and managed AWS infrastructure using Terraform and Infrastructure as Code practices

✓ Built monitoring dashboards and alerting systems using
Prometheus and Grafana for CPU, memory, disk usage,
application health, and deployment metrics

✓ Created deployment, troubleshooting, and operational runbooks
  for production-style environments

Currently seeking:

• Junior DevOps Engineer
• Junior SRE
• Platform Engineering Intern

Passionate about automation, reliability, and continuous improvement. I enjoy building scalable systems, reducing manual effort through automation, and documenting solutions that improve operational efficiency.
`;

export const resume = `# resume.md

Name:         Aveelash Hota
Role:         Junior DevOps Engineer / Junior SRE

Resume PDF: https://drive.google.com/file/d/1JUfEgofnn3SfYxbxM2ZjRmVRV9OWZAZH/view?usp=sharing

## Summary

Project-driven Junior DevOps Engineer with hands-on experience
building CI/CD pipelines, cloud infrastructure, containerized
applications, Kubernetes deployments, and Infrastructure as Code.

Experienced in automating deployments, provisioning cloud
resources, implementing monitoring solutions, and building
production-style DevOps workflows through real-world projects
and internship experience.

Passionate about automation, reliability, observability,
and continuous improvement.

## Core Skills

Linux            Docker           Git
GitHub Actions   Kubernetes       Terraform
AWS              Prometheus       Grafana
Nginx            Bash             YAML

## Featured Projects

1. End-to-End DevSecOps Pipeline
2. Production-Ready Container Platform
3. Monitoring & Observability Stack
4. Kubernetes Deployments
5. Terraform AWS Infrastructure

## Contact

Email:    aveelash.hota04@gmail.com
GitHub:   github.com/aveelash
LinkedIn: linkedin.com/in/aveelash-hota-442317338
`;

export const projects = [
  {
    file: "itomata-cicd.md",
    title: "ITOMATA CI/CD Platform",
    description:
      "Internship project focused on automating application delivery using CI/CD pipelines, containerization, infrastructure automation, and Kubernetes deployments.",

    githubUrl: "https://github.com/aveelash/itomata_cicd_project",

    docUrl: "#",

    body: `# ITOMATA CI/CD Platform
Overview

Built an automated CI/CD workflow as part of an internship project
to streamline application deployment and infrastructure management.

Architecture

Developer
│
▼
GitHub
│
▼
GitHub Actions
│
▼
Docker Build
│
▼
Security Scanning
│
▼
Container Registry
│
▼
Kubernetes Deployment

What I Built
Automated CI/CD workflows using GitHub Actions
Dockerized application deployment process
Infrastructure provisioning using Terraform
Kubernetes deployment automation
Integrated security scanning into deployment pipeline
Deployment validation and monitoring workflow
Technologies

GitHub Actions
Docker
Kubernetes
Terraform
AWS
Linux

Key Learnings
Designing reliable deployment pipelines
Infrastructure automation principles
Kubernetes deployment strategies

CI/CD troubleshooting and debugging
`,
  },

  {
    file: "devsecops-project.md",
    title: "DevSecOps Pipeline",

    description:
      "End-to-end DevSecOps implementation combining Infrastructure as Code, container security, CI/CD automation, and cloud deployment.",

    githubUrl: "https://github.com/aveelash/DevSecOps_Project",

    docUrl: "#",

    body: `# DevSecOps Project

Overview

Designed and implemented a complete DevSecOps workflow
that integrates security practices throughout the software
delivery lifecycle.

Architecture

Developer
│
▼
GitHub
│
▼
GitHub Actions
│
▼
Code Analysis
│
▼
Docker Build
│
▼
Security Scan
│
▼
AWS Infrastructure
│
▼
Deployment

What I Built
Automated CI/CD pipeline
Docker containerization workflow
Terraform infrastructure provisioning
Security scanning and validation within CI/CD workflows
Security scanning integration
AWS deployment automation
Infrastructure as Code implementation
Technologies

AWS
Terraform
Docker
GitHub Actions
Linux
DevSecOps

Key Learnings
Shift-left security practices
Infrastructure automation
Secure deployment workflows

CI/CD security integration
`,
  },

  {
    file: "blue-green-deployment.md",

    title: "Blue-Green Deployment Platform",

    description:
      "Implemented a Blue-Green deployment strategy to achieve near-zero downtime application releases and safer production deployments.",

    githubUrl: "https://github.com/aveelash/Blue-Green-Deployment",

    docUrl: "#",

    body: `# Blue-Green Deployment

Overview

Implemented a Blue-Green deployment strategy that allows
new application versions to be deployed safely while
minimizing downtime and deployment risk.

Architecture

Users
│
▼
Load Balancer
│
┌─┴─┐
▼   ▼
Blue Environment   Green Environment

What I Built
Blue-Green deployment workflow
Traffic switching strategy
Deployment rollback process
Docker-based application deployment
Release validation workflow
Technologies

Docker
Linux
Nginx
CI/CD
Deployment Automation

Key Learnings
Zero-downtime deployment techniques
Rollback strategies
Production deployment practices

Release management workflows
`,
  },

  {
    file: "devops-go-web-app.md",

    title: "DevOps Go Web Application",

    description:
      "Containerized Go application deployed using modern DevOps practices including Docker, CI/CD automation, monitoring, and infrastructure management.",

    githubUrl: "https://github.com/aveelash/devops-go-web-app",

    docUrl: "#",

    body: `# DevOps Go Web App

Overview

Built and deployed a Go-based web application using
modern DevOps workflows and deployment practices.

Architecture

User
│
▼
Nginx
│
▼
Go Application
│
▼
Docker Container

What I Built
Containerized Go application
Docker-based deployment workflow
Reverse proxy configuration
CI/CD integration
Linux server deployment
Monitoring-ready architecture
Technologies

Go
Docker
Nginx
Linux
GitHub Actions

Key Learnings
Go application deployment
Containerization best practices
Reverse proxy configuration
Production application management
`,
  },
];

export const recruiter = `# Recruiter Snapshot

Name: Aveelash Hota

Target Roles:
• Junior DevOps Engineer
• Junior Site Reliability Engineer (SRE)
• Platform Engineering Intern

Technical Stack:

Linux • Docker • Kubernetes • AWS
Terraform • GitHub Actions
Prometheus • Grafana • Nginx • Git

What I Bring:

✓ Hands-on experience building real-world DevOps projects

✓ CI/CD pipeline automation using GitHub Actions

✓ Infrastructure as Code with Terraform

✓ Containerization and deployment using Docker & Kubernetes

✓ Monitoring, alerting, and observability using
Prometheus & Grafana

✓ Troubleshooting experience across Linux,
Docker, CI/CD pipelines, and Kubernetes deployments

✓ Strong documentation and operational runbook writing habits

Featured Projects:

ITOMATA CI/CD Platform
CI/CD Automation • Docker • Kubernetes • Terraform
DevSecOps Pipeline
AWS • Terraform • Security Scanning • GitHub Actions
Blue-Green Deployment Platform
Zero-Downtime Deployments • Rollback Strategy
DevOps Go Web Application
Docker • Nginx • CI/CD • Linux

Why Interview Me?

I learn by building and documenting real projects.

Rather than only studying DevOps concepts, I apply them
through hands-on projects involving automation,
containerization, cloud infrastructure, deployment
pipelines, monitoring, and operational best practices.

I am actively expanding my skills in Kubernetes,
cloud-native technologies, GitOps, and Site Reliability
Engineering while building production-style projects.

GitHub:
github.com/aveelash

LinkedIn:
linkedin.com/in/aveelash-hota-442317338

Contact:
aveelash.hota04@gmail.com`;

export const skills = {
  strong: ["Linux", "Git", "Docker", "GitHub Actions", "AWS", "Terraform"],

  practicing: ["Kubernetes", "Prometheus", "Grafana", "Nginx"],

  next: [
    "Helm",
    "ArgoCD",
    "Alertmanager",
    "Advanced Networking",
    "Incident Response",
  ],
};

export const contact = `# contact.md

  email     ${candidate.email}
  github    ${candidate.githubHandle}
  linkedin  ${candidate.linkedinHandle}`;

export const quickCommands = [
  "/summary",
  "/recruiter",
  "/projects",
  "/experience",
  "/education",
  "/skills",
  "/impact",
];

export const allCommands = [
  "/help",
  "/about",
  "/recruiter",
  "/resume",
  "/experience",
  "/skills",
  "/projects",
  "/github",
  "/impact",
  "/contact",
  "/certifications",
  "/education",
  "/readme",
  "/clear",
];

// File tree mapping: path -> output type + payload
export const fileTree = [
  { type: "file", path: "README.md" },
  { type: "file", path: "resume.md" },

  {
    type: "folder",
    name: "projects",
    children: projects.map((p) => ({
      type: "file",
      path: `projects/${p.file}`,
    })),
  },

  {
    type: "folder",
    name: "github",
    children: [{ type: "file", path: "github/repositories.md" }],
  },

  { type: "file", path: "contact.md" },
];

export const about = `# About Me

Hi, I'm Aveelash Hota.

I'm a Junior DevOps Engineer focused on automation,
cloud infrastructure, CI/CD pipelines, and platform reliability.

My journey began with full-stack web development
(MERN Stack), where I learned how modern applications
are designed, built, and deployed.

As my interest grew in infrastructure, scalability,
monitoring, and automation, I transitioned into
DevOps and cloud technologies.

Today I work with:

• Linux
• Docker
• Kubernetes
• AWS
• Terraform
• GitHub Actions
• Prometheus
• Grafana

I enjoy building hands-on, production-style projects
focused on Infrastructure as Code, containerization,
CI/CD automation, monitoring, observability, and
reliable application delivery.

Currently, I'm expanding my expertise in Kubernetes,
cloud-native technologies, GitOps practices, and
Site Reliability Engineering while continuously
building real-world DevOps projects.

My goal is to help engineering teams build and operate
reliable, scalable, and secure systems through
automation, cloud-native technologies, and modern
DevOps practices.
`;

export const impact = `# Career Highlights

✓ Designed and implemented end-to-end DevSecOps workflows
using GitHub Actions, Terraform, AWS, Docker, Kubernetes,
and automated security validation

✓ Automated build, test, security scanning, infrastructure
provisioning, and deployment workflows using GitHub Actions
and Terraform

✓ Built production-style CI/CD pipelines that automated
build, test, security scanning, and deployment workflows,
improving deployment consistency and reducing manual effort

✓ Implemented container security scanning and automated
validation checks within deployment workflows

✓ Built Prometheus and Grafana dashboards to monitor
CPU, memory, disk usage, application health, and
deployment metrics

✓ Developed deployment, rollback, troubleshooting,
and operational runbooks for production-style environments

✓ Continuously build hands-on DevOps projects focused on
automation, cloud-native technologies, and reliability engineering

Current Focus:

• Kubernetes & Cloud-Native Technologies

• GitOps & Deployment Automation

• Site Reliability Engineering (SRE)

• Infrastructure as Code & Platform Engineering

• Monitoring, Observability & Incident Response
`;

export const experience = `# Experience

DevOps Intern

ITOMATA

Contributed to DevOps automation initiatives focused on
CI/CD workflows, containerization, infrastructure automation,
and Kubernetes-based application deployment.

Responsibilities

✓ Built and maintained CI/CD pipelines using GitHub Actions

✓ Automated application deployment workflows

✓ Worked with Docker for containerized application delivery

✓ Assisted with Kubernetes deployment and configuration tasks

✓ Supported infrastructure provisioning using Terraform

✓ Participated in deployment validation, troubleshooting,
and operational documentation

Technologies Used

• GitHub Actions
• Docker
• Kubernetes
• Terraform
• AWS
• Linux
• Git

Key Takeaways

Gained practical experience in modern DevOps workflows,
deployment automation, Infrastructure as Code, container
orchestration, and cloud-native deployment practices while
working in a collaborative engineering environment.`;

export const github = `
# GitHub

Profile:
github.com/aveelash

## Featured Repositories

✓ ITOMATA CI/CD Platform (Internship Project)
CI/CD automation using GitHub Actions, Terraform, Kubernetes, AWS

✓ DevSecOps Pipeline
End-to-end pipeline with security scanning, CI/CD automation, and Infrastructure as Code

✓ Blue-Green Deployment Platform
Zero-downtime deployment strategy with safe release and rollback mechanisms

✓ DevOps Go Web Application
Containerized Go application using Docker, Nginx, and CI/CD workflows

## Core Engineering Focus

• CI/CD Pipeline Automation
• Infrastructure as Code (Terraform)
• Containerization (Docker)
• Kubernetes Deployments
• Cloud Infrastructure (AWS)
• Monitoring & DevSecOps Practices

## Summary

Building production-style DevOps systems focused on automation, scalability, reliability, and cloud-native deployment workflows.

github.com/aveelash
`;

export const certifications = `# Certifications

AWS Cloud Foundations

Issued: April 2025

Certificate ID: 3G72R3W2

Certificate Link: https://drive.google.com/file/d/1dygomEAHKNxzVBLbH-Rh57Cz8r0Ag2Ds/view?usp=sharing

Skills Covered:

✓ Cloud Computing Fundamentals

✓ AWS Global Infrastructure

✓ Compute, Storage, and Networking Concepts

✓ Cloud Security Fundamentals

✓ AWS Core Services Overview

✓ Cloud Architecture Best Practices

Current Learning Path:

• Advanced AWS Services
• Terraform & Infrastructure as Code
• Kubernetes & Cloud-Native Technologies
• GitOps & Platform Engineering
• Site Reliability Engineering (SRE)
`;

export const education = `
# Education

Bachelor of Technology (B.Tech)
Computer Science(Cloud Computing & Automation)

College: Vellore Institute of Technology(VIT), Bhopal
Duration: 2022 – 2026 (Expected)

## Relevant Coursework

• Operating Systems (Linux fundamentals, process management, memory, shell basics used in DevOps environments)
• Computer Networks (HTTP/HTTPS, DNS, TCP/IP, load balancing, reverse proxy concepts used in Nginx and deployments)
• Database Management Systems (SQL fundamentals, data modeling, backend data flow in web applications)
• Data Structures & Algorithms (problem-solving skills applied in scripting, automation logic, and backend workflows)
• Cloud Computing Basics (AWS fundamentals, virtualization, scalability, and distributed system concepts)
• Programming in Python (automation scripting, DevOps tooling, backend utilities, and task automation)

## DevOps-Focused Practical Exposure

• CI/CD pipelines using GitHub Actions (build, test, and deployment automation)
• Docker containerization (image creation, networking, multi-container applications)
• Kubernetes fundamentals (pods, deployments, services, scaling, and basic cluster operations)
• Infrastructure as Code using Terraform (AWS resource provisioning and automation)
• Monitoring & Observability (Prometheus & Grafana dashboards for system and application metrics)
• Linux & Bash scripting for automation and system operations

## Additional Learning (Hands-on DevOps Focus)

• DevOps & Cloud Engineering (self-driven learning through real-world CI/CD and deployment projects)
• AWS Cloud (hands-on experience with EC2, IAM, S3, and infrastructure provisioning using Terraform)
• Docker & Kubernetes (containerization, multi-container setups, deployments, scaling, and basic cluster operations through projects)
• Infrastructure as Code (Terraform) (automated AWS resource provisioning and environment setup)
• CI/CD with GitHub Actions (automated build, test, security checks, and deployment pipelines)
• Monitoring & Observability (Prometheus & Grafana for tracking system metrics and application health in project environments)
• Python for DevOps Automation (basic scripting for task automation, workflow optimization, and tooling support)

## Highlights

✓ Built and deployed multiple end-to-end DevOps projects involving CI/CD pipelines, containerization, and cloud infrastructure (AWS)
✓ Gained hands-on experience with real-world DevOps workflows including Docker, Kubernetes, Terraform, and GitHub Actions
✓ Implemented automation for build, test, and deployment processes to simulate production-grade delivery pipelines
✓ Focused on cloud-native development practices including Infrastructure as Code, monitoring, and scalable deployment strategies
✓ Actively practicing production-style DevOps workflows with emphasis on reliability, automation, and system observability
`;
