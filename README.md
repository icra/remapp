# remapp

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

----
### Tool Update

To add new case studies to the tool, these should be added to the 
**public/case_studies.xlsx** file, or replace the current file for the one already updated
and add the corresponding images to each new case to the **public/caseStudies/** folder.


The file **case_studies.xlsx** has 3 sheets, which order cannot be altered:
1. *membrane_reuse_options:* Contains information about membrane reuse options (survey outcome), recommended data to
   produce second-hand membranes and unique ids for the case studies involved on each outcome. 
   When adding a new case, add only its unique id to this last column **image_id**. 
2. *case_studies:* Contains information of the case studies. Each row refers to one unique case study.
   New case studies have to be added at the end, continuing the **image_id** numeration.
3. *version:* To keep track of the version number of the tool and when was first created. This information is then displayed on the application. 

* **NOTE:** When updating and saving the new file, Microsoft Excel must be used (avoid open source programs such
  as LibreOffice or Open Office that may cause performance problems when reading data).
  

The images of the new case studies added have to be saved such as 
**unique_id.JPG** and saved on the following folder **public/caseStudies/**.
So, if the new case added has "43" as its unique id, the image will be **43.JPG**
* **NOTE:** It is important to save the images in *.JPG format and assure the extension
  is written in capital letters **JPG**, otherwise they won't be loaded.
  
**IMPORTANT:** The headers cannot be modified. Other sensible cells are already blocked
to avoid inadvertently modifications that might cause problems on the tool.