<a name="readme-top"></a>


[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![webos][webos-shield]][webos-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/dudgns128/webos-gardening">
    <img src="https://github.com/dudgns128/webos-gardening/assets/62871662/1d8a4364-3a3b-406f-aaeb-34b23df09717" alt="Logo" style="width: 60%;">
  </a>
  <h3 align="center">Smart Home Gardening Project with WebOS</h3>
  <p align="center">
    It's a webOS-based smart home gardening project with remote and automatic control!
    <br />
    <br />
    <a href="https://github.com/dudgns128/webos-gardening/issues">🐞 Report Bug</a>
    ·
    <a href="https://github.com/dudgns128/webos-gardening/issues">💬 Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>🗂️ Table of Contents 🗂️</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li><a href="#specifications">Specifications</a>
     <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#system-architecture">System Architecture</a></li>
       <li><a href="#hardware-setup">Hardware setup</a></li>
     </ul>
    </li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## About The Project

<p align="center" style="display: flex; justify-content: space-between;">
    <img src="https://github.com/dudgns128/webos-gardening/assets/62871662/99b70587-d427-4ed7-b7bd-177a4a2d32dd" 
         alt="projectImage1" 
         style="width: 49%;">
    <img src="https://github.com/dudgns128/webos-gardening/assets/62871662/43271141-2471-45ff-8fb0-1dbcd2d7e109" 
         alt="projectImage2" 
         style="width: 49%;">
</p>


### Development Motivation and Description

[Difficulty in growing and managing plants at home]
- Time and cost burden to manage plants every day, and barriers to entry into cultivation and management, especially for beginners
- When growing at home, each environmental condition (wind, sunlight, humidity, temperature, etc.) is different, so there is a limit to cultivating only by referring to the manual

[Features for user convenience and satisfaction]
- **Automatic control to maintain appropriate environmental conditions according to plant species**, **monitoring companion plant conditions**, and **managing companion plant affection** through JS service between HW and web apps
- Development of external servers and mobile pages to implement user information management, **remote control (watering/light volume)**, and **multiple individual plant management functions**

### Key Features

**1. Automation of Maintaining Optimal Environmental Conditions Based on Plant Species**

  - **Real-time data collection** is achieved through sensors connected to an Arduino, including temperature and humidity sensors, light sensors, and moisture sensors.
    
  - Based on the collected sensor data, an **automatic watering system and light control system create suitable environments for different plants automatically.**

  - The appropriate environmental conditions for each plant species are stored in a database using domain knowledge in botany. For instance, cacti require temperatures of 30-40°C during the day and 10°C at night, with high light levels and 40-60% humidity, while peonies require temperatures of 18-25°C and 50-70% humidity.

**2. Meeting Various User Needs**

  - The system supports both **an automation mode for convenient management** and **a customization mode for users who wish to interact directly with their plants.** Users can switch between modes without restrictions. For example, someone who enjoys watering their plants manually can use the customization mode but switch to automation mode when they need to be away for an extended period.
  
  - Through a mobile web interface, users can monitor plant conditions and environmental factors remotely, such as light and moisture levels, and make adjustments as needed.

<!-- specifications -->
## Specifications

### Built With
#### WebApp

[![React][React.js]][React-url][![npm][npm]][npm-url][![HTML5][HTML5]][HTML5-url][![JavaScript][JavaScript.js]][JavaScript-url][![Figma][Figma]][Figma-url][![Nodejs][Nodejs]][Nodejs-url][![HTTP][HTTP]][HTTP-url]

- **webOS Emulator**: Pre-built image applied in a local environment using VS Code extension webOS Studio for React app development.
- **Luna-bus API**: Used to interact with the JS service.
- **HTTP Communication**: Used for server interaction.

#### JS-service

[![JavaScript][JavaScript.js]][JavaScript-url][![Nodejs][Nodejs]][Nodejs-url][![npm][npm]][npm-url][![WEBSOCKET][WEBSOCKET]][WEBSOCKET-url][![LS2API][LS2API]][LS2API-url]

- **Main Logic**: Implemented within the JS service in webOS.
- **DB8**: Used as the internal database in webOS.
- **Functionality**: Handles tasks like plant automation control, leveling up, satisfaction metrics, and HW sensor data collection.
- **Remote Control**: Communicates with an external server via WebSocket.


#### External Server

[![AWS][AWS]][AWS-url][![WEBSOCKET][WEBSOCKET]][WEBSOCKET-url][![HTTP][HTTP]][HTTP-url][![Spring][Spring]][Spring-url]

- **Spring Boot**: Utilized for server construction.
- **REST Controllers**: Designed using HTTP for functionalities like login and registration.
- **WebSocket Controllers**: Designed for real-time data transmission.
- **Spring JPA**: Used for database configuration and setup.
- **AWS EC2 Ubuntu**: Environment for server deployment.

  
#### Database

[![MySQL][MySQL]][MySQL-url][![InfluxDB][InfluxDB]][InfluxDB-url]

- **MySQL**: Stores basic data such as user and plant information.
- **InfluxDB**: Used for storing time-series data, appropriate for environmental sensing information collected every 5 seconds, deemed unsuitable for RDBMS.


#### Hardware

[![LG][LG]][LG-url][![Arduino][Arduino]][Arduino-url][![Raspberry][Raspberry]][Raspberry-url]

- **Devices**: Raspberry Pi 4 flashed with webOS pre-built image, Arduino, display resolution set to 1920x1080.
- **Sensors**: DHT11, CDS light sensor, water level sensor, NeoPixel connected via I2C communication.
- **Data Handling**: Sensor data read through Arduino IDE and transmitted to Raspberry Pi 4.
- **Control**: Arduino controls motor and NeoPixel settings based on commands from Raspberry Pi.

#### Development Environment

[![window][window]][window-url]

### System Architecture


  <summary>🖼️ System Architecture 🖼️</summary>
  
  <p align="center" style="display: flex; justify-content: space-between;">
    <img src="https://github.com/dudgns128/webos-gardening/assets/62871662/d195e54b-0019-48d7-a6bd-de325828ab61" alt="System Architecture" style="width: 66%;">
  </p>



  <summary>🖼️ Database ERD 🖼️</summary>
  
  <p align="center" style="display: flex; justify-content: space-between;">
    <img src="https://github.com/dudgns128/webos-gardening/assets/62871662/95a01590-4a6f-4642-b032-fc596e9324af" alt="Database ERD" style="width: 66%;">
  </p>
<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Hardware Setup

#### Raspberry Pi
* HardWare : Raspberry Pi 4 Model B 8GB

* OS : WebOS OSE

1. Download WebOS image from [WebOS OSE](https://github.com/webosose/build-webos/releases)
 
     <img width="899" alt="pre build image file" src="https://github.com/dudgns128/webos-gardening/assets/62871662/16e99917-2954-41f6-8a28-02c64be7f586">


2. Extracting image files
    * Uncompressed using the [7-zip](https://www.7-zip.org/) program

    * You can decompress it and a folder called webos-ose-2-24-0-raspberrypi4-64.tar is created.

    * If you enter the folder, there is a .tar file, and you can proceed with decompressing it.

    * Uncompressed creates a folder called webos-ose-2-24-0-raspberrypi4-64.
 
    * When you enter the folder, you'll find a .mic file, which means the Image file is ready.


3. Formatting SD Cards
    * You can refer to it and format the SD card.
    * Windows 10 default format doesn't matter!


4. Image flashing to sd card
    * Image flashing to sd card using program : [Win 32 Disk Imager](https://sourceforge.net/projects/win32diskimager/) 
    * Please select the .mic file obtained above, select the SD card you formatted, and press the Write button.
    * It's taking some time.
    * Done! Now when you insert the SD card into the bottom of the Raspberry Pi and boot it up, WebOs will boot normally!
   
* If Writing Successful appears, you have successfully flashing the image on the sd card.

#### TouchDisplay & Sensor

* TouchDisplay : Raspberry Pi Display 10.1-Inch Touch Screen LCD
* DHT11 : A sensor used to measure temperature and humidity
* NeoPixel : A brand of addressable LEDs developed by Adafruit for control Light 

  <img width="899" alt="HW + SENSOR " src="pre build image file">

<!-- GETTING STARTED -->
# Getting Started

This guide will help you set up and run the project in your local environment. Follow these steps to get started.

> **Note:** This guide is tailored for a setup on **a single local PC**, And your device, whether it is an emulator or a Raspberry Pi, must be **running continuously**.


1. Clone the repository.
   ```sh
   git clone https://github.com/dudgns128/webos-gardening.git
   ```
2. Move into the cloned directory.
   ```sh
   cd webos-gardening\gardening_react
   ```
3. Install npm
   ```sh
   npm install
   ```
   
4. Open Git Bash
   ```sh
   ./deploy.sh <name of device>
   ```   

step is detailed in the `README.md` file of the respective folder, allowing you to sequentially progress and gather the necessary information.


## Contact

### 💡 김영훈 ([dudgns128](https://https://github.com/dudgns128)) : [xoals128@naver.com](mailto:xoals128@naver.com)

### 💡 박지환 ([hw-ani](https://https://github.com/hw-ani)) : [pcbmlh73@gmail.com](mailto:pcbmlh73@gmail.com)

### 💡 김재훈 ([nanocode00](https://github.com/nanocode00)) : [rwg0901@naver.com](mailto:rwg0901@naver.com)

### 💡 오승우 ([dhtmddn00](https://github.com/dhtmddn00)) : [dhtmddn00@gmail.com](mailto:dhtmddn00@gmail.com)

### 💡 홍지승 ([HONG-2019110129](https://https://https://github.com/HONG-2019110129)) : [wltmd3847@naver.com](mailto:wltmd3847@naver.com)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/dudgns128/webos-gardening.svg?style=for-the-badge
[contributors-url]: https://github.com/dudgns128/webos-gardening/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/dudgns128/webos-gardening.svg?style=for-the-badge
[forks-url]: https://github.com/dudgns128/webos-gardening/network/members
[stars-shield]: https://img.shields.io/github/stars/dudgns128/webos-gardening.svg?style=for-the-badge
[stars-url]: https://github.com/dudgns128/webos-gardening/stargazers
[issues-shield]: https://img.shields.io/github/issues/dudgns128/webos-gardening.svg?style=for-the-badge
[issues-url]: https://github.com/dudgns128/webos-gardening/issues
[license-shield]: https://img.shields.io/github/license/noFlowWater/signage_solution.svg?style=for-the-badge
[license-url]: https://github.com/moby/moby/blob/master/LICENSE
[webos-shield]: https://img.shields.io/badge/webos%20official%20example-A50034?style=for-the-badge&logo=lg
[webos-url]: https://www.webosose.org/samples/2023/12/21/facial-recognition-kiosk-using-webos
[product-screenshot]: images/screenshot.png

[React.js]: https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=000
[React-url]: https://reactjs.org/

[license-shield]: https://img.shields.io/github/license/noFlowWater/signage_solution.svg?style=for-the-badge
[license-url]: https://github.com/noFlowWater/signage_solution/blob/master/LICENSE.txt

[Figma]: https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=fff
[Figma-url]: https://www.figma.com/

[Flask]: https://img.shields.io/badge/Flask-000?style=for-the-badge&logo=flask&logoColor=fff
[Flask-url]: https://flask.palletsprojects.com/en/3.0.x/

[HTTP]: https://img.shields.io/badge/HTTP-%23ED2761?style=for-the-badge&logo=&logoColor=fff
[HTTP-url]:https://www.cloudflare.com/ko-kr/learning/ddos/glossary/hypertext-transfer-protocol-http/

[HTML5]: https://img.shields.io/badge/HTML5-%23FF4000?style=for-the-badge&logo=HTML5&logoColor=fff
[HTML5-url]: https://html.com/html5/

[LS2API]: https://img.shields.io/badge/LS2API-%234608560?style=for-the-badge&logo=LS2API&logoColor=fff
[LS2API-url]: https://www.webosose.org/docs/reference/ls2-api/ls2-api-index/

[AWS]: https://img.shields.io/badge/AWS-%23232F3E?style=for-the-badge&logo=amazonwebservices&logoColor=fff
[AWS-url]: https://aws.amazon.com/ko/?nc2=h_lg

[WEBSOCKET]: https://img.shields.io/badge/webSocket-%23BC52EE?style=for-the-badge&logo=webSocket&logoColor=fff
[WEBSOCKET-url]: https://websocket.org/

[InfluxDB]: https://img.shields.io/badge/InfluxDB-%2322ADF6?style=for-the-badge&logo=influxdb&logoColor=fff
[InfluxDB-url]: https://www.influxdata.com/

[Arduino]: https://img.shields.io/badge/Arduino-%2300878F?style=for-the-badge&logo=arduino&logoColor=fff
[Arduino-url]: https://www.influxdata.com/

[window]: https://img.shields.io/badge/Window-%230078D4?style=for-the-badge&logo=windows&logoColor=fff
[window-url]: https://www.microsoft.com/software-download/windows11

[spring]: https://img.shields.io/badge/Spring-%236DB33F?style=for-the-badge&logo=spring&logoColor=fff
[spring-url]: https://spring.io/

[Socket.io]: https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=fff
[Socket.io-url]: https://socket.io/

[Nodejs]: https://img.shields.io/badge/Node.js-393?style=for-the-badge&logo=nodedotjs&logoColor=fff
[Nodejs-url]: https://nodejs.org/en

[Prisma]: https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=fff
[Prisma-url]: https://www.prisma.io/

[OpenCV]: https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=fff
[OpenCV-url]: https://opencv.org/

[npm]: https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=fff
[npm-url]: https://www.npmjs.com/

[MySQL]: https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=fff
[MySQL-url]: https://www.mysql.com/

[Python.org]: https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white
[Python-url]: https://www.python.org/

[JavaScript.js]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[JavaScript-url]: https://developer.mozilla.org/ko/docs/Learn/JavaScript

[Raspberry]: https://img.shields.io/badge/Raspberry%20Pi-A22846?style=for-the-badge&logo=raspberrypi&logoColor=fff
[Raspberry-url]: https://www.raspberrypi.com/

[LG]: https://img.shields.io/badge/webOS-A50034?style=for-the-badge&logo=lg&logoColor=fff
[LG-url]: https://www.webosose.org/
