# DPG LARGE FORMAT
# PDF ROLL CALL - A STICKER ROLL PROCESSING TOOL
# Written by John Sam Fuchs for Delta Print Group
# 8/20/21
#
# - Select a folder containing sticker sheet PDF files
# - The tool will calculate how many rolls of vinyl (assuming 150' in length) it will take to print these files
# - The tool also takes cut registration marks into account and gives you a relatively large breathing room
# - Click submit, and the tool will separate the files into folders based on what Roll they go on

import os
import tkinter
import shutil

from decimal import Decimal
from tkinter import filedialog
from tkinter import *
from PyPDF2 import PdfFileReader

import tkinter.font as font

#global variables
global rollIndex
global totalLength
global estimateText
global dirSel
global sheetQty
global maxRollLength
global spaceBetweenSheets
rollIndex = 1
totalLength = 0
estimateText = 'Rolls Required: 0' + ' - Total Length: 0'
sheetQty = 0
maxRollLength = 1740
spaceBetweenSheets = 3

# main container
root = Tk()
root.title("LF Roll Call v1.0")

estimateText = StringVar()
directory = StringVar()

# frame
frame = Frame(root, relief = 'flat',
              bd = 1, bg = '#6A3D58')
frame.pack(fill = 'both', expand = True,
           ipadx = 10, ipady = 4)
# font
myFont = font.Font(family='Roboto', size = 12)


def pointsToInches(points):
    output = points / 72
    return output


def fileCheck(dirCheck):
    for file in os.listdir(dirCheck):
        if file.endswith('.pdf'):
            f = open(dirCheck + '/' + file, 'rb')
            pdf = PdfFileReader(f)
            mediaBox = pdf.getPage(0).mediaBox
            length = pointsToInches(mediaBox.getHeight())
            f.close()
            addLength(length, file)
            sheetQty = sheetQty + 1

def addLength(length, file):
    global totalLength
    global rollIndex
    
    if not os.path.isdir(dirSel + '/' + 'ROLL ' + str(rollIndex)):
        os.mkdir(dirSel + '/' + 'ROLL ' + str(rollIndex))

    oldPath = dirSel + '/' + file
    newPath = dirSel + '/ROLL ' + str(rollIndex) + '/' + file
    oldPath = str(oldPath)
    newPath = str(newPath)
    shutil.move(oldPath, newPath)
    
    length = Decimal(length)
    totalLength = totalLength + length + spaceBetweenSheets
    if totalLength > maxRollLength:
        rollIndex = rollIndex + 1
        totalLength = 0

def folderPath():
    root.foldername =  filedialog.askdirectory()
    directory.set(root.foldername)
    global dirSel
    dirSel = root.foldername
    estimate = 0
    for file in os.listdir(dirSel):
        if file.endswith('.pdf'):
            f = open(dirSel + '/' + file, 'rb')
            pdf = PdfFileReader(f)
            mediaBox = pdf.getPage(0).mediaBox
            estimate = estimate + Decimal(pointsToInches(mediaBox.getHeight())) + 3
            f.close()
            estimateText.set('Rolls Required: ' + str(round((estimate / maxRollLength),2)) + ' - Total Length: ' + str(round(estimate,2)))
        else: estimateText.set('No PDFs found in directory.')
            
            
def submitter():
    fileCheck(dirSel)

infoLabel = Label(frame, text="Select a folder containing print files you'd like to separate into rolls.", font=myFont)
infoLabel2 = Label(frame, text="After selecting the folder, click Submit.", font=myFont)
infoLabel.configure(fg='#FFFFFF', bg='#6A3D58')
infoLabel2.configure(fg='#FFFFFF', bg='#6A3D58')
uploader = Button(frame, text="Select Folder",  fg='black', bg='white', command=folderPath, font=myFont, width=30)
submitButton = Button(frame, text="Submit", command=submitter, fg='white', bg='#6a3d58', font=myFont, width=30)
locationLabel = Label(frame, textvariable=directory, font=myFont)
estimateLabel = Label(frame, textvariable=estimateText, font=myFont)
estimateLabel.configure(fg='#FFFFFF', bg='#6A3D58')
locationLabel.configure(fg='#FFFFFF', bg='#6A3D58')

infoLabel.pack(pady=4)
infoLabel2.pack(pady=4)
uploader.pack(pady=4)
submitButton.pack(pady=4)
estimateLabel.pack(pady=4)
locationLabel.pack(pady=4)

root.mainloop()
