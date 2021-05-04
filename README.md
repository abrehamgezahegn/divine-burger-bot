<!-- PROJECT LOGO -->
<br />
  <h3 align="center">Divine burger bot</h3>


<!-- ABOUT THE PROJECT -->
## About The Project

Divine-burger-bot is a online food delivery telegram bot made for a  fast food restuarant called Divine burger.

Features at glance :
* Browse menu 
* Add items to cart 
* Order to any location or dine in
* Get notification of discounts and competitions


### Built With

* [NodeJS](https://nodejs.org/) 
* [Mongodb](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
* [node-telegram-bot-api](https://www.npmjs.com/package/node-telegram-bot-api)



<!-- GETTING STARTED -->
## Getting Started

Setting up this project is easy and straight forward

### Installation

1. Get a free API Key at [https://t.me/botfather)
2. Clone the repo
   ```sh
   git clone https://github.com/abrehamgezahegn/divine-burger-bot.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API in `.env`
   ```JS
    BOT_TOKEN= [YOUR_TELEGRAM_BOT_KEY]
    TELEGRAM_GROUP_ID=[YOUR_TELEGRAM_GROUP_ID]
    DATABASE_URL=[YOUR_MONGODB_DATABASE_URL]
   ```

# Repository overview
    Structure
         ├──src  
            ├── controllers
            |   ├── cart
            |   ├── home
            |   ├── order
            ├── events	
            │   ├── load_models.py (fetches models from drive)
            │   ├── predict.py
            ├── schemas
            ├── staticData
            ├── utils
            ├── index.js


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request




<!-- CONTACT -->
## Contact

Abreham Gezahegn - abreham0913@email.com

Project Link: [@divineburger_bot ](https://t.me/divineburger_bot)




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
