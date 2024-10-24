from csv2pdf import convert  # Importing the csv2pdf library to convert CSV files to PDF
import pandas as pd  # Importing pandas for data manipulation and analysis
import os  # Importing os to interact with the operating system (e.g., directories and files)
import pdfkit  # Importing pdfkit to convert HTML to PDF
import requests  # Importing requests to send HTTP requests
import json  # Importing json to work with JSON data
from datetime import date, timedelta  # Importing date and timedelta for date manipulation

# Function to convert CSV files in a directory to .txt files by renaming them
def convertCSVtoTxt():
    # Directory where CSV files are located
    directory = "C:\\Users\\alex0\\OneDrive\\Desktop\\firefly-congress-app\\app\\lib\\sample_data_txt"

    print(directory)  # Print the directory path

    # Loop through files in the directory
    for filename in os.listdir(directory):
        if filename.endswith(".csv"):  # Check if the file ends with .csv
            # Rename the file from .csv to .txt
            os.rename(os.path.join(directory, filename), os.path.join(directory, filename[:filename.index(".")] + ".txt"))
            open("")  # This line seems unnecessary and can likely be removed

# Function to remove the character before "g/m3" and replace it with "u" (likely the unit symbol μ)
def removeMu():
    directory_csv = "C:\\Users\\alex0\\OneDrive\\Desktop\\firefly-congress-app\\app\\lib\\sample_data"
    
    # Loop through files in the directory
    for filename in os.listdir(directory_csv):
        oldname = os.path.join(directory_csv, filename)
        with open(oldname, 'r') as file:
            data = file.read()  # Read the file's content

            # Replace the character before "g/m3" with "u"
            data[data.index("g/m3)") - 1] = "u" 

            print(data)  # Print the modified data

        # Write the modified data back to the file
        with open(oldname, 'w') as file:
            file.write(data)

# Function to convert CSV files to PDF
def convertCSVtoPDF():
    directory_csv = "C:\\Users\\alex0\\OneDrive\\Desktop\\firefly-congress-app\\app\\lib\\sample_data"
    directory_pdf = "C:\\Users\\alex0\\OneDrive\\Desktop\\firefly-congress-app\\app\\lib\\sample_data_pdf"

    # Loop through CSV files in the directory
    for filename in os.listdir(directory_csv):
        if filename.endswith(".csv"):  # Check if the file is a CSV
            oldname = os.path.join(directory_csv, filename)
            newname = os.path.join(directory_pdf, filename[:filename.index(".")] + ".pdf")

            # Read the file and replace the μ character with 'u'
            with open(oldname, 'r') as file:
                data = file.read().replace('μ', 'u')
                print(data)  # Print the modified data

            # Write the modified data back to the file
            with open(oldname, 'w') as file:
                file.write(data)

            # Load the CSV file into a pandas DataFrame and convert it to an HTML table
            df = pd.read_csv(oldname, index_col=[0])
            html_table = df.to_html()

            # PDF conversion options (margins, page size, etc.)
            options = {    
                'page-size': 'Letter',
                'margin-top': '0mm',
                'margin-right': '0mm',
                'margin-bottom': '0mm',
                'margin-left': '0mm'
            }
    
        # Path to wkhtmltopdf executable
        exeFile = r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe'
        pdfkit.configuration(wkhtmltopdf=exeFile)
        pdfkit.from_string(html_table, newname, options=options)  # Convert HTML table to PDF

# Function to iterate through a date range (inclusive)
def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days + 1)):  # Loop from start_date to end_date
        yield start_date + timedelta(n)  # Yield each day in the range


# Function to fetch JSON data from an API for each day within a date range
def getJsonData():
    directory_pdf = "C:\\Users\\alex0\\OneDrive\\Desktop\\firefly-congress-app\\app\\lib\\sample_data_json"
    
    # Loop through each day from Jan 2, 2010 to Sep 1, 2024
    for single_date in daterange(date(2024, 9, 1), date(2024, 10, 22)):
        # Get the day, month, and year
        day = single_date.day
        month = single_date.month
        year = single_date.year

        # Format the month, day, and year as strings with leading zeros if necessary
        monthUpd = f"{month}".zfill(2)
        dayUpd = f"{day}".zfill(2)
        yearUpd = f"{year % 100}".zfill(2)

        print(year, month, day)  # Print the current year, month, and day

        # Construct the URL to my api for fetching data based on the current date
        api_url = f"http://localhost:3000/api/day-summaries?year={year}&month={month}&day={day}"
        
        # Send a GET request to the API
        response = requests.get(api_url)

        if response.status_code == 200:  # Check if the request was successful
            data = response.json()  # Parse the JSON data
            newname = os.path.join(directory_pdf, f"smoke_summary_{yearUpd}_{monthUpd}_{dayUpd}.json")
            # Save the JSON data to a file
            with open(newname, 'w') as file:
                file.write(json.dumps(data))

# Call the function to start fetching and saving JSON data
getJsonData()