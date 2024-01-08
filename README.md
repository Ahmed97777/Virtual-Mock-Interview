# Virtual-Mock-Interview
"Virtual Mock Interview" or VMI is a platform that helps job seekers enhance their interviewing skills and helps companies filter potential employees using multiple ML models to analyze the interviewer behavior and their ability to answer questions.
### Previews
<p align="center">
  <img width="800" src="https://github.com/Ahmed97777/Virtual-Mock-Interview/assets/65557776/4123980b-581f-45e6-abea-a8ae60388891">
</p>
<p align="center">
  <img width="800" src="https://github.com/Ahmed97777/Virtual-Mock-Interview/assets/65557776/5ae1c66a-0276-430c-920a-2eed6542cc57">
</p>
<p align="center">
  <img width="800" src="https://github.com/Ahmed97777/Virtual-Mock-Interview/assets/65557776/4066ac5f-ead9-4a00-894a-2ff806b77223">
</p>

### Models and their usage:
#### Facial Models:
- [Mediapipe](https://github.com/google/mediapipe) for iris tracking --> Indicates focus level
- [Residual Masking Network](https://github.com/phamquiluan/ResidualMaskingNetwork) for facial emotion detection --> indicates energy level
<p align="center">
  <img width="460" src="https://github.com/Ahmed97777/Virtual-Mock-Interview/assets/65557776/4da6e764-d75d-4527-9d74-0d66764b0aea">
  <img width="450" src="https://github.com/Ahmed97777/Virtual-Mock-Interview/assets/65557776/1e61151a-aafb-4b72-b9a4-a1e169d82905">
</p>

#### Audio Models:
- [Librosa](https://github.com/librosa/librosa) a deep learning audio analysis library
- [whisper](https://github.com/openai/whisper) for the speech to text task
<p align="center">
  <img width="450" src="https://github.com/Ahmed97777/Virtual-Mock-Interview/assets/65557776/3847b624-c7b0-4f86-b410-c53db72719b3">
</p>

### Large Language Model:
- [GPT](https://platform.openai.com/docs/api-reference/chat) API for feedback in a natural language form.
<p align="center">
  <img width="450" src="https://github.com/Ahmed97777/Virtual-Mock-Interview/assets/65557776/5b00b1b1-bf1a-497d-8ac0-bd2c0481d9c7">
</p>

### Configuration:

#### Backend
1. Clone the project
2. Navigate to the backend directory `cd virtual_mock_interview/vmi-api`
3. Setting up conda environment:
   - Download [Anaconda](https://www.anaconda.com/download) if not installed
   - Create conda environment `conda create -n myenv python`
   - Activate it `conda activate myenv`
4. Download required dependencies `pip install -r requirments.txt`
5. Setting up mysql database for questions table:
   - Download _mysql workbench_` and _mysql server_ if not installed through [download link](https://dev.mysql.com/downloads/workbench/)
     (Note: check 'start mysql server at system startup' and 'grant mysql server file permission' to avoid tons of hustle later. Watch a [tutorial](https://www.youtube.com/watch?v=qBBXBZXKi0w) if confused )
   - Start a new mysql connection and fill the information (Note: You can fill it anything but make sure you remember them as you will enter them in `.flaskenv` later on)
     ```
      connection name: vmi-schema
      host name: 127.0.0.1
      port: 3306
      username: admin
      password: #set your own password
     ```
     then test the connection, if successful press ok and click on _vmi_schema_
   - Right click on tables, _table data import wizard_ and add the questions.csv file which could be found in _#####link_
  6. locate `.flaskenv_example` in the backend directory, rename it to `.flaskenv`, and add your database credentials.
     You will also need an OpenAI API key which could be optained from [API Keys](https://platform.openai.com/account/api-keys)
  8. Initing the flask server and the local file server:
     - Open a terminal and navigate to the backend directory `cd virtual_mock_interview/vmi-api`
     - Activate conda environment `conda activate myenv`
     - Run the flask server `flask run`
       (Note: the first run will take a while as both models _whisper_ and _Residual Masking Network_ download and cache their model weights)
     -  Once the flask server is up and running open another terminal, navigate to the backend directory and run the local file server `python local_file_server.py`

#### Frontend
  8. - Open a third terminal, navigate to the frontend directory `cd virtual_mock_interview` and run `npm install` to install the frontend dependencies
     - Start the npm server via `npm start`

#### Documentation
Detailed documentation could be found in docs/

#### Issues or inquiries
Please reach out if you have any question regarding this project by openning an issue, DMing one of the three contributers or email me at _ahmedalycess@gmail.com_

Ahmed Aly.
       
