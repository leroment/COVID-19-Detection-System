# COVID-19-Detection-System

## Development
### Download the project
1. Install `git`
2. Clone project `git clone https://github.com/leroment/COVID-19-Detection-System.git`

### Running Django API
#### Setup
1. Install [Python](https://www.python.org/)
2. Install `virtualenvwrapper-win` with `python -m pip install virtualenvwrapper-win`
3. Navigate to `COVID-19-Detection-System/backend` folder in terminal
4. Run `mkvirtualenv covid_backend`
5. Run `workon covid_backend`
6. Run `python -m pip install -r requirements.txt`

#### Running
1. Run `workon covid_backend`
2. Run `python manage.py runserver`

The Django API should now be running. Test by going to [http://127.0.0.1:8000/api/users/](http://127.0.0.1:8000/api/users/)

### Running React website
#### Setup
1. Install [Node](https://nodejs.org/en/)
2. Install [Yarn](https://classic.yarnpkg.com/en/)
3. Navigate to `COVID-19-Detection-System/website` folder in terminal
4. Run `yarn`

#### Running
1. Run `yarn start`
2. Open [http://localhost:3000](http://localhost:3000)

Edit files in `COVID-19-Detection-System/website/src` to make changes to the site.
