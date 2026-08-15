# Porting to Deno Design

### Background

We have created several past portfolio websites as a domain that I can introduce myself to other on the internet. There are multiple reasons for which we created the website, in the past where coding wasn't as popular this website provided an avenue such that I can demonstrate my coding ability and highlight my projects. This website anchored secondary as my resume where I list all my achievements and current employment status. 

## Objective

We are looking to port our current Gatsby portfolio website into a Deno typescript website. The content is to remain the same however the design and the implementation is expected to change to leverage the power of Deno.
### Prior Design

The prior website can be found here: ./BullPointe_2.0/portfolio/src

This was a Gatbsy website with react components that we developed to be interactive with the user and while also being relatively simple to use and navigate.  We had chosen Gatsby as it was a clean engine that allowed us to use React to develop our website. It was also simple to deploy the website through Netifly, which is the current hosting platform.
## Design

Deno is a powerful all-in-one typescript engine that will allow us to simplify our development, maintenance, and future-proof our website. 

Our main issue stems with the current design is having to deal with old Node.js packages that cause several conflicts when we attempt to upgrade our project to account for security vulnerabilities. As a result we are looking for modern solutions that will allow us to learn new technologies but also allow us to keep our website lean and maintainable. 

Although we are looking to port the website, we are also looking to do a face-lift of the website. Since we are in a different era of development and have the luxury of AI coding tools we can be more flexible in our front-end styling requirements. However we we want the content of the different pages to remain intact and port without any changes.

Below we list the main goals that we want to achieve with the Deno engine, and the aspects that we want to keep from the current implementation. 
#### Main Requirements

These are ordered in the level of importance with the user heavily kept in mind

1. We are looking to stay mobile friendly, such that users can navigate on their laptop, tablet, and mobile
	- The same website should be able render on all platforms, either through dynamic sizing. 
	- We want to keep a single website that scales accordingly, but our target is Mobile and Laptops
2.  We want the website to be lightweight and fast, allowing for users to load the different pages within a second with minimal latency
3. Provide a space for introducing myself, a longer dialogue about myself, my employment and education timeline, and present my personal projects
4. A new aspect that we want to introduce to the website is a personal blog:
	- We are looking to be able to easily add new entries to the website, this can be documenting things that have happened in my life or cool things that I have engineered
	- These entries will be formatted in markdown.
5. Future-proof: Our maintenance of the website is very limited, approximately couple times a year. Therefore we must make sure to keep the website design simple and readable enabling quick and easy debugs.
	- Downtime is not tolerable: If not related to the hosting service our website should not have any downtime in aspects failing to build or load
6. Our current website has google analytics to track users and engagement we would like to continue this in the new website
	- One aspect that was missed in prior iterations was the ability to track the users across the website, we only had clicks and where the user geolocation. 
	- However we lacked the ability to see how the user progressed through the website and whether they went through the child pages after the main header page.

### Pages UX Design

In this section we will discuss the different pages that we expect to see in the website. Each of these pages have their own purpose providng new information for the reader. 

#### Theme

Now this may sound simple but we are not looking for a simple html website but rather a refined website.  But take a look at the inspirations as they have better references for what we are looking for.

This means the font and the arrangement of content is very important. 
###### Inspirations

 https://increment.com/software-architecture/ whose colors are:
	Background: #f2f2f2
	Headers: #000
	Sub Text: #595959

https://maggieappleton.com/garden whose colors are:
	 Background: #1c1b18
	 Text #c3bfbb
	This design allows for colors to pop which we leveraged with our current design 
	
https://www.imkylelambert.com colors:
	 Background: #209bff
	 Text: #ffffff
	 Used a variety of colors to for their recent articles which pops out
### Format
Hence we have chosen the following color scheme and font

Some pixellaxted background in the background

Background: #11305c
Text: #ffffff

All the pages will follow this particular theme and format for the content.
#### Landing Page

This page will be the primary page that users will interact with whose goal is to inform the reader who I am, my interests and what I am working on.

A by-product of this page is to draw them into clicking further through the website, this is expected to be tracked by the google analytics cookies.
#### Navigation Menu

Prior iterations of the website had a drop down menu that would cover the page showing the different pages. We are have decided to shift from that design and opt for a simpler design with the navigation menu sitting at the top right of the page. This should result in a much more accessible navigation menu for mobile users. 
#### About Me Page

Contains more information about me and how I found my way to the current state. The content is pretty well defined in the current website and should only require very few changes if not none.
#### Timeline Page

Contains all the information for all the education and roles that I have held in the past and current. This should remain in the timeline format that exists now as we want to easily show the progression of the career.

One improvement on the current design is that we want this timeline to it centered in the page with lines going out on both sides with the Year being highlighted in the middle of the timeline. It should read very simple as the user scrolls down the page they can see each milestone year (we don't need to see each year if nothing happened)
#### Projects Page

Contains all the information for the different projects that I have worked on. The order and the format at which these are presented are not important as these projects are older and dated. However the main goal of this should be that users can see a project, a small description, and if they want to see more be able to get the forwarding link to the project or image.

### Blog Page

Contains links for all the future blog posts and links to other mediums for which I can highlight my work or post my own thoughts and ideas.

##### Blogs Entries

Each blog entry should be formatted like markdown so that it is easy for the reader to follow, with bookmark jump points at the top of the page for the user to jump through the blog entry. However only showing up to level 2 headings so we dont overcrowd the page.  

Something to explore is whether we want the table of contents to on the side however this can limit the readability on mobile and hence we are currently sticking with the TOC on the top of the page.

### Technical Design

We are choosing to leverage Deno as our javascript engine and pivoting away from the React engine in prior portfolios.

We will choose to use Tailwind CSS as our primary CSS engine to simplify and unify our components style.

#### Artifacts

We have several different artifacts that we are aiming to display on the website each with different formats. As a result we are looking to formalize the formats of each so that we can easily add new artifacts and easily define templates that can be re-used for the respective pages. These artifacts includes images, jobs, projects, and sections.

Our goal is that maintenance in the future will be very simple including adding new markdown files and linking them where appropriate.  This way we can stabilize the website and limit the number of modification that could prevent building the website. We have observed in the past it becomes cumbersome to edit certain pages and websites when it is all HTML. 

### Landing and About Me 

We propose utilizing markdown for the content of the pages: this includes the Landing Page and About Me Page.

These contents can be queried and rendered onto the respective pages, allowing for easy edits in the future. How we organize the contents is up to debate as we need to leverage Deno to enable this kind of feature.

### Projects and Timeline 

The data aspects of the project are for the different projects and the for the timeline page. For these content we propose having a json file. For the projects json each entry in the json file will be a particular project, connected images, and date. In similar this data will be queried and displayed in a table or row format on the page. The descriptions if possible should be their own markdown file as well for which we point towards with json file.

For the timeline json file it follow the same format as the projects with additional fields company, however for the company data we will point to a markdown file as those information are much more detailed and harder to edit on a json file. 
### Blog 

This data will be held in a json file with Title,Author, Date, and linked markdown. This way when we need to add a new entry we just write the markdown blog and update the json file. 

Each entry will most definitely be markdown files with their respective information. 

The only open question in this would be our ability to inlay images which might require more effort to handle. 

For now we will not include images, and if we have to it will be hyperlinked instead of inlaid the website.
