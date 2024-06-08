# Getting Started - webOS WebApp with React

## Developing webOS apps/services by webOS Studio

webOS Studio is an Microsoft Visual Studio Code (VS Code) extension for webOS. Using this extension, developers easily start to make webOS apps/services (web app, Enact app, JS service).

So, we recommend that developing apps/services through webOS Studio rather than using only the Command-Line Interface (CLI).

[[Reference] webOS OSE](https://www.webosose.org/docs/tools/sdk/vs-code-extension/)

[[Reference] Visual Studio](https://marketplace.visualstudio.com/items?itemName=webOSSDK.webosstudio)

## System Requirements

### Hardware

Emulator-related features are not supported in Apple Silicon Mac.

[[Reference] webOS OSE](https://www.webosose.org/docs/tools/sdk/emulator/virtualbox-emulator/emulator-user-guide/)

### Software

|**Software**|**Required version**|
|------|------|
|Microsoft Visual Studio Code|1.58.0 or higher|
|Node.js|v14.15.1 or higher (verified on v14.15.1 and v16.20.2)|
|Python|3.6 or higher|
|VirtualBox|6.1|

## Setting Up Node.js on Your Local PC

If you haven't installed Node.js on your local PC, please complete the installation of Node.js.
Once installed, verify the installation by running `node -v` in your command line or terminal. This will display the installed version of Node.js.

- This project was carried out in a Node.js v16.20.2 environment.

Move to React project's root directory
```sh
cd webos-gardening/gardening_react
```

## Configuring Server Addresses in `src/const.js`

To ensure proper communication between the client and servers, modify the server addresses in the `src/const.js` file:

1. Locate and open the `src/const.js` file in your project's directory.
   

2. Update the server addresses and port numbers to match those of the server you want to communicate with.
   ```javascript
   // src/const.js
   export const server = 'http://{IP address of server}:{Port number}';
   // Replace the IP addresses and port as needed.
   ```
   When running the project locally, you must change some of the code.
   
   `src/pages/UserSignup.js`
   - Annotate the inside of **onSubmit()** and leave only **navigate('/user/login')**

   ```javascript
   // const onSubmit = async () => {} 
   ```

   `src/pages/UserPlantRegister.js`
   - Annotate the inside of **onSubmit()** and leave only **navigate('main')**
   - Annotate the code line:30~56 and Store a list of plant species in **PLANT_SPECIES_LIST**
   - Annotate the code line:107~112 and Store the information inside the **payload** as arbitrary content

   ```javascript
   // const onSubmit = async () => {} 
   
   const PLANT_SPECIES_LIST = ['Cactus', 'Sunflower', 'Tulip']

   // const selectedPlant = plantList.find(plant => plant.scientificName === plantSpecies);
   // if (selectedPlantId !== null && plantList.length > 0) {
   // localStorage.setItem('description', selectedPlant.shortDescription); 
   const payload = {
      "plantId": 1,
      "plantName": "my plant",
      "plantBirthDate": "2024-06-10",
      "scientificName": "love",
      "shortDescription": "hi",
      "maxLevel": 10,
      "imageUrls": {
        "normal": "https://i.sstatic.net/Bzcs0.png",
        "happy":"." ,
        "sad":"." ,
        "angry":"." ,
        "underWater":"." ,
        "overWater":"." ,
        "underLight":"." ,
        "overLight":"." ,
        "underTemperature":"." ,
        "overTemperature":"." ,
        "underHumidity":"." ,
        "overHumidity":"." ,
      },
      "properEnvironments": {
        "waterValue": 50,
        "waterRange": 10,
        "lightValue": 70,
        "lightRange": 10,
        "temperatureValue": 30,
        "temperatureRange": 5,
        "humidityValue": 60,
        "humidityRange": 10,
      }
    }
   ```


## Basic Setup webOS Client With React

Before starting the setup process, ensure the following requirements are met:

- **Raspberry Pi Setup**: You should have a Raspberry Pi that successfully boots with the webOS OSE image.

|**Version**|**Support Device**|
|------|------|
|For webOS OSE 2.0.0 or Higher|Raspberry Pi 4 Model B|
|For webOS OSE 1.x|Raspberry Pi 3 Model B|

If you cannot afford to build the image on your own, try with pre-built images.

[[Reference] webOS OSE](https://www.webosose.org/docs/guides/setup/flashing-webos-ose/)

- **Network Connection**: The Raspberry Pi and your local PC must be connected to the same network. This connection is essential for the setup process using the webOS OSE CLI from your local PC.

- **Node.js on Local PC**: Node.js must be installed on your local PC as it is required to run the webOS OSE CLI. 

- (Optional) **Raspberry Pi Display**: We are planning to develop a kit including a display. UI/UX on the local PC is equal, so you can refer to this setup when you want to use the display. 

We know that the display that supports Raspberry Pi 4 only has 1024x600 resolution. However, the webOS OSE 2.0.0 version officially supports HDMI and can be connected to a touch-enabled FHD (1920x1080) display. So you have to adjust the resolution.


[[Reference] for Korean](https://evanjelly.tistory.com/m/57)


## Installing the webOS OSE CLI

1. Install the webOS OSE CLI by executing the following command:
   ```sh
   sudo npm install -g @webosose/ares-cli
   ```

2. After installing the webOS OSE CLI, you can verify its installation by running:
   ```sh
   ares
   ```
3. To set up a new device for development, use the ares-setup-device command. This will guide you through the process of registering and configuring a new device for your development environment:
   ```sh
   ares-setup-device
   ```
   <img style="width: 70%;" alt="ares-setup-device" src="[ares-install-device](https://github.com/dudgns128/webos-gardening/assets/62577519/b8f1ac66-d0b0-4280-b4bf-839e84d9372b)">
   
   - Adding a target device with interactive mode (target device name: target, host address: 10.123.45.67, port number: 22, user: root)

   ```sh
   ares-setup-device

   name               deviceinfo               connection  profile
   ------------------ ------------------------ ----------- -------
   emulator (default) developer@127.0.0.1:6622 ssh         ose

   ** You can modify the device info in the above list, or add a new device.
   ? Select: add
   ? Enter Device Name: target
   ? Enter Device IP address: 10.123.45.67
   ? Enter Device Port: 22
   ? Enter ssh user: root
   ? Enter description: sample
   ? Select authentication: password
   ? Enter password: [hidden]
   ? Set default? Yes
   ? Save? Yes

   name               deviceinfo               connection profile
   ------------------ ------------------------ ---------- -------
   target (default)   root@10.123.45.67:22     ssh        ose
   emulator           developer@127.0.0.1:6622 ssh        ose
   ```
   
4. To verify the devices that are already set up, use the following command:
   ```sh
   ares-install --device-list
   ```

<br/>This will list all the devices that have been set up and are ready for development.<br/>

## Deployment Script: deploy.sh

Before running the `deploy.sh` script, ensure you are in the root directory of the React project, which is the parent directory where the `build` will be created. The `deploy.sh` script automates the building and deploying process of the project.

### Requirements
- The `deploy.sh` script should be located in the react project's root directory.
- An `icon.png` file should also be placed in the react project's root directory.
- Raspberry Pi with webOS set must be powered on
- The local PC (from which you are deploying) and the Raspberry Pi must be connected to the same network for successful deployment.
- The JS Service directory is placed in the same path as the Application directory

[[Reference] webOS TV Developer](https://webostv.developer.lge.com/develop/guides/js-service-usage)

### deploy.sh Script

The `deploy.sh` script performs the following actions:

- Builds the React project.
- Creates the appinfo.json file and copies the icon.png file into the build directory.
- Packages the application and JS services into an IPK file.
- Removes any existing installation of the app on the specified device.
- Installs and launches the new version of the app on the device.
- Opens the app inspector for debugging purposes.
- Cleans up by removing the build and IPK directories.

### Script Usage
The script takes five arguments:

- Device name
- App ID
- App version
- Vendor name
- App title

**Note:** Currently, it is hardcoded instead of a parameter except for the device name for simplification. If necessary, you can modify it. For Windows users, .sh files are executable through Git Bash.


5. Install Dependencies
   ```sh
   npm install
   ```
6. Change its execution permission with the following command:
   ```sh
   chmod +x deploy.sh
   ```
7. To deploy your project, execute the deploy.sh script from the root directory of your React project:
   ```sh
   ./deploy.sh {DEVICE_NAME} #{APP_ID} {APP_VERSION} {VENDOR_NAME} {APP_TITLE}
   ```
   example usage:
   ```sh
   ./deploy.sh #display com.team17.homegardening 1.0.0 "my team" "new app"
   ```

<br/>
This script simplifies the deployment process, ensuring that your application is built, packaged, and deployed efficiently to your target device.
<br/>
<br/>

**Note:** When the `deploy.sh` script removes any existing installation of the app, you may encounter an error message in the console during the initial deployment, or if the app corresponding to the `APP_ID` does not exist on the device. This error is not a major concern and does not impede the deployment process.


