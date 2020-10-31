<script src="https://koda.nu/simple.js"> 

/* Programmet hittar nya primtal upp till en given maxgräns.
När den är färdig ger den exekveringstiden det tog.
Uppgiften var att hitta primtal från 1-100, men programmet kan hitta primtal högre än detta genom att modifiera värdet på findPrimesUpTo */
//© Sofia Rosberg 2020


//Konfig
var findPrimesUpTo = 100;
var primenumbers = [2, 3];  		
  
function start()
{
  	var t0 = new Date().getTime(); // Starttid för tidsräknare
	var toCheck;
	
	//Undersöker vilka tal som är primtal 
	for (var n = 6; n <= findPrimesUpTo; n = n+6)
	{      
		//Undersöka kandidaterna av formen 6n + 1 och 6n - 1
      		for (var pm = -1; pm < 2; pm = pm + 2)
        	{
          		toCheck = n+pm; 
			isPrime = true;
		
			//Kontrollerar om talet är delbart med något tidigare primtal, då är det inte ett primtal
			for (var i = 0; primenumbers[i]*primenumbers[i] <= toCheck; i++)
			{
				if (toCheck % primenumbers[i] === 0)  
				{
					isPrime = false;
					break;
				}

			}

			//Om det var ett primtal läggs det till i listan med befintliga primtal
			if (isPrime)
			{
				primenumbers.push(toCheck);
			}
        	}

	}
	
	//Skriver ut listan med alla hittade primtal i slutet och exekveringstiden i s
  	var timeDeltaTime = new Date().getTime() - t0;
  	alert("Execution time is: " + timeDeltaTime/1000 + " s");
	alert(primenumbers); 
}
</script>








