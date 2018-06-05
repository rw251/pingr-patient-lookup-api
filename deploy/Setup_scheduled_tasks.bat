REM ================================
REM == Create the scheduled tasks ==
REM ================================

SET START.BAT=D:\pingr-patient-lookup-api\start.bat

SchTasks /RU system /Create /SC ONSTART /TN "PINGR patient lookup api" /TR "\"%START.BAT%\""

REM Might need to restart TaskEng.exe to pick up new env variables
REM Also if you setup a task with a /RI and a /DU then it doesn't pick of env vars - but if you do it without then it's fine:
REM e.g. the following fails:
REM SchTasks /RU system /Create /SC DAILY /TN "PINGR Email Reminder" /TR "\"%BATCH.DIRECTORY%RunEmailReminderScript_ST_DEBUG.bat\"" /RI 60 /ST 04:03 /DU 23:00
REM but if you modify it to:
REM SchTasks /RU system /Create /SC HOURLY /TN "PINGR Email Reminder" /TR "\"%BATCH.DIRECTORY%RunEmailReminderScript_ST_DEBUG.bat\"" /ST 04:03
REM then it works!.
