@Codebase
# cursor compose template
modify to add these user function calls

## get greeting
- function name: get_greeting
- description: get a greeting for a given name
- workflow: 
  - get a name from the user
  - return a greeting
- args:
  - name: string
- returns:
  - data: json
  - status
  
## get aprs
- function name: get_aprs
- description: get h2 farming apr status
- workflow: get json from this url "https://api.h2.finance/general/api/info/v1/farm-aprs"
- args:
  - none
- returns:
  - data: json
  - status