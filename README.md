# WeatherShopper challenge

## Table of Contents

- [WeatherShopper challenge](#weathershopper-challenge)
  - [Table of Contents](#table-of-contents)
  - [Objective](#objective)
  - [Tech Stack](#tech-stack)
  - [External Dependencies and Versions](#external-dependencies-and-versions)
  - [Setup](#setup)
  - [Running](#running)
    - [Available Scripts](#available-scripts)
      - [tests](#tests)
      - [Docker](#docker)
  - [Structure](#structure)
    - [Constants](#constants)
    - [Page Actions](#page-actions)
    - [Page Objects](#page-objects)
    - [Specs](#specs)
    - [Utils](#utils)
    - [WebdriverIO Configuration](#webdriverio-configuration)
  - [Formatting](#formatting)
  - [Reporting](#reporting)
    - [Spec](#spec)
    - [Allure Report](#allure-report)
    - [Screenshots](#screenshots)
  - [CI / CD](#ci--cd)
    - [GitHub Actions](#github-actions)
    - [GitHub Pages](#github-pages)
      - [Allure Report](#allure-report-1)
  - [Updates:](#updates)
  - [Challenge notes](#challenge-notes)
  - [Notes](#notes)

## Objective

WeatherShopper challenge, containing the following:

-   Open the `https://weathershopper.pythonanywhere.com/` page.
-   Read the displayed temperature.
-   If the temperature is below 19 degrees, buy moisturizers.
    -   Select the least expensive moisturizer that contains Aloe.
    -   Select the least expensive moisturizer that contains Almond.
-   If the temperature is above 34 degrees, buy sunscreens.
    -   Select the least expensive sunscreen that is SPF-50.
    -   Select the least expensive sunscreen that is SPF-30.
-   Click on cart.
-   Validate the shopping cart.
-   Fill the payment details and submit the form. Note: In [this page](https://stripe.com/docs/testing#cards) it is available some test cards information.
-   Validate that the payment was successful.

## Tech Stack

-   [NodeJS](https://nodejs.org/)
-   [WebdriverIO](http://webdriver.io/)

## External Dependencies and Versions

To run this project, ensure that you have already installed:

-   **Java v14.0.x**: You can download Java SE Development Kit from [here](https://www.oracle.com/java/technologies/javase/jdk14-archive-downloads.html) to install it.

-   **Node v20+**: example [v20.10.0](https://nodejs.org/dist/v20.10.0/node-v20.10.0.pkg).

-   **Docker v4**: example [latest](https://docs.docker.com/desktop/mac/install/).

## Setup

After cloning the project, go to the project directory and execute `npm install`.

All the node dependencies should now be installed and the tests ready to be executed.

## Running

All the scripts used to run this project are _npm_ based, so they are all specificated on the `package.json` file.

To run a script: `npm run <script_name>`

### Available Scripts

#### tests

Running `npm run tests` will launch a Selenium Server instance and use it to run the tests.

This task will run all tests defined inside `./tests/specs` folder.

To run only tests from a specific file, use the following command: `npm run tests -- --spec <spec_file_path>`. e.g.: `npm run tests -- --spec ./tests/specs/weathershopper.js`

#### Docker

The tests can also be executed in Docker.

To do that just run the command: `npm run tests:docker`.

To see what is happening inside the node container, head to http://localhost:7901 (no password is required).

## Structure

### Constants

-   `./tests/constants`: Where all the defined constants are defined.

### Page Actions

-   `./tests/page-actions`: Where all the page actions are defined.

### Page Objects

-   `./tests/page-objects`: Where all the defined page objects are defined.

### Specs

-   `./tests/specs`: Where all the tests are defined.

### Utils

-   `./tests/utils`: Where all the utilities functions are defined.

### WebdriverIO Configuration

The project base configurations are located in the `wdio.conf.js` file.

## Formatting

The prettier package is used so that the code follows a consistent and unique presentation style. For prettier configurations please check the `package.json` file.

## Reporting

### Spec

When you run the tests, a default `spec` reporter is printed at the end of the execution via stdout.

### Allure Report

It is also available the Allure report, that provides a graphical view of the tests results.

After running the tests, the Allure report can be generated with the command: `npm run report:allure`

To cleanup the allure report folders, the following command can also be used: `npm run report:allure:cleanup`

For specific doubts about Allure framework, please read the [Allure documentation](https://allurereport.org/docs/).

### Screenshots

This project also has screenshots integrated with the Allure report. Those screenshots are taken when the tests fail, and can be seen in the filesystem (`screenshots` folder), and directly in the Allure report by selecting the failed test.

Note: We should take a screenshot only when the test fails, but currently due to this bug it is not possible:

-   [Jasmine afterTest() wdio hook returns wrong passed value for failed spec as passed=true](https://github.com/webdriverio/webdriverio/issues/11684)

## CI / CD

### GitHub Actions

-   This project is integrated with [GitHub Actions](https://docs.github.com/en/actions/quickstart). On every commit the tests will be triggered. The tests can also be triggered manually by clicking in the `Run workflow` button of the `Challenge Tests` workflow.

### GitHub Pages

-   This project is also integrated with [GitHub Pages](https://pages.github.com/).

#### Allure Report

-   The Allure Report is integrated with GitHub Pages. The Allure Report is available here: [Allure Report](https://pedr0fig.github.io/weathershopper/)

References:

-   [How to create a GitHub gh-pages branch in an existing repository](https://blog.ediri.io/how-to-create-a-github-gh-pages-branch-in-an-existing-repository)
-   [Host your Automation Allure Report on GitHub Pages with GitHub Actions](https://dev.to/sadia/host-your-automation-allure-report-on-github-pages-with-github-actions-56a)

## Updates:

-   Docker selenium images: https://github.com/SeleniumHQ/docker-selenium/releases
-   Docker seleniarm images: https://github.com/seleniumhq-community/docker-seleniarm/releases
-   Docker nodeJS images: https://hub.docker.com/_/node?ref=login&tab=description

## Challenge notes

-   To validate the proposed scenarios, I have decided to create only one test that, according to the current temperature, will buy moisturizers, sunscreens, or nothing.
-   The test will then select the cheapest products that match the specified terms, and will add them to the cart.
-   The cart is validated in these situations:
    -   When it is empty;
    -   When it has only one item;
    -   When it has two items;
-   In the checkout page, it is validated that:
    -   The selected items (including the descriptions and price) are in the checkout page;
    -   That no item is missing, and that no extra item is being displayed.
    -   The total cost of the products.
-   The payment is then filled in with some testing credit card information.
    -   The payment form is inside a iframe, so it is required to change frames to perform the payment.
    -   It is validated in the payment form that the total cost is correct.
-   After click in the Pay button, it is validated that a success message is displayed.
    -   It is mentioned that %5 of the times the payment will fail. Nothing was done from the tests side, since that is a implementation error and the test should fail when that occurs.
-   Some extra comments:
    -   To help in any required debugging, it is printed to the console some useful information.
    -   No hardcoded values were used. All dynamic information (strings and values) are stored in constant files.

## Notes

Currently (due to some bug) to run tests in docker, in the `package.json` file, these package versions must be used:
`"@wdio/cli": "8.16.18"`
`"@wdio/local-runner": "8.14.0"`
