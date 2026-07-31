@echo off
echo Copying pillar images to images folder...
set "SRC=C:\Users\HP\.gemini\antigravity-ide\brain\fc8bc43b-61ae-4a56-8cfb-85f77df17565"
set "DST=%~dp0images"

copy /Y "%SRC%\pillar_steel_1784805497813.png"     "%DST%\pillar_steel.png"
copy /Y "%SRC%\pillar_ferro_1784805508330.png"     "%DST%\pillar_ferro.png"
copy /Y "%SRC%\pillar_aluminium_1784805536257.png" "%DST%\pillar_aluminium.png"
copy /Y "%SRC%\pillar_power_1784805547785.png"     "%DST%\pillar_power.png"
copy /Y "%SRC%\pillar_agrotech_1784805559030.png"  "%DST%\pillar_agrotech.png"

echo.
echo Done! All 5 pillar images copied to the images\ folder.
pause
