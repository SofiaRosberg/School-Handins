<script src="https://koda.nu/simple.js">

// ”hang-man” : du ska gissa ordet innan du blir hängd
//© Sofia Rosberg 2020

//Globala variabler:
var wordtoguess;
var letterslefttoguess;		
var displaytext = "";										
var scalesizefactorY = totalHeight / 1080;
var scalesizefactorX = totalWidth / 1920;
var scalesizefactor1D = (totalWidth * totalHeight) / (1920 * 1080);	
var scalesizefactoranswerbox = 35;	
var alreadyguessedletters = [];
var hangmancolor = 'gray';

  
//Konfig    
var screentextcolor = 'black';				//Standard = 'black';
var lives = 15;							//Standard: 15 försök	
var easy_presavedwords = ["elbow", "shine", "fever", "storm", "buy"];  
var medium_presavedwords = ["dividend", "retreat", "express", "threat", "honest"];
var difficult_presavedwords = ["insistence", "radiation", "guarantee", "established", "transparent"];
var insane_presavedwords = ["jazz", "buzz", "rhythm", "zephyr", "zugzwang"];
var lowerbound_UTF8index = 97; //Standard: karaktärkod för a
var upperbound_UTF8index = 122; //Standard: karaktärkoden för z
var extraspecialchars = ["å","ä","ö"];
var loselivesfactor = 1; //Standard: 1
var wordsizelimit = 29; //Standard: 29, längsta engelska ordet är 29 bokstäver långt
      
//Easy: 3-5 bokstäver
//Medium: 6-8 bokstäver
//Hard: >8 bokstäver
//Insane, lycka till ;)  

function start()
{
	//Användaren väljer mellan att din kompis skriver in ett ord eller att datorn slumpar fram ett
	if (confirm("Klicka på OK om du vill att din kompis skriver in ett ord. Klicka på avbryt om du vill att datorn ska slumpa fram ett ord åt dig att gissa."))
    	{
      		var usingillegalcharacters = true;
      		while (wordtoguess === null || usingillegalcharacters)
        	{
              		usingillegalcharacters = false;
					wordtoguess = prompt("Skriv in ditt ord här: ", "");
              
              		//Avslutar spelet om du klickat på avbryt
					if (wordtoguess === null)
                    {
                      	return;
                    }

              		//Kollar så att du ej skrivit med icke-tillåtna bokstäver
              		for (var i = 0; i < wordtoguess.length; i++)
                	{
                    	if (wordtoguess.charCodeAt(i) < lowerbound_UTF8index || wordtoguess.charCodeAt(i) > upperbound_UTF8index)
                     	{
                          	usingillegalcharacters = true;
                          	
                          	//Kollar så att dessa ej tillhör listan med tillagda specialkaraktärer
                            for (var j = 0; j < extraspecialchars.length; j++)
                            {
                                if (wordtoguess.charAt(i) === extraspecialchars[j])
                                {
                                    usingillegalcharacters = false;
                                  	break;
                                }
                            }
                          	if (usingillegalcharacters)
                            {
                          		alert("Sorry, somewhere you're using letters not allowed");
                          		break;
                            }
                      	}

                    }
              
              
              //Ordet får max vara 29 bokstäver långt
              if (wordtoguess.length > wordsizelimit)
              {
              	alert("Sorry, your word is too long. Max 29 characters allowed");
              	usingillegalcharacters = true;
              }
              
              
			}
			
            

		}
	
  	else
    	{
		while (wordtoguess === undefined)
		{
			let difficultyfactor = prompt("Skriv svårighetsgrad: 1 för lätt, 2 medium, 3 difficult eller 4 insane","");
			
            //Avslutar spelet om du klickat på avbryt
            if (difficultyfactor === null)
            {
            	return;  
            }
          
          	//Användaren får välja svårighetsgrad
			switch (difficultyfactor)
          		{
              			case '1':
					wordtoguess = easy_presavedwords[(random(easy_presavedwords.length-1))];
					break;
              			case '2': 
					wordtoguess = medium_presavedwords[(random(medium_presavedwords.length-1))];
                    loselivesfactor = 2;
					break;
              			case '3':
					wordtoguess = difficult_presavedwords[(random(difficult_presavedwords.length-1))];
					loselivesfactor = 3;
                    break;   
              			case '4':
					wordtoguess = insane_presavedwords[(random(insane_presavedwords.length-1))];
                			break;
			}
		}
	}
 	
	//Om ordet är längre än 10 bokstäver, måste svarsrutorna skalas ned
  	letterslefttoguess = wordtoguess.length;
  	if (wordtoguess.length > 7 )
    	{
		scalesizefactoranswerbox = scalesizefactoranswerbox - (wordtoguess.length - 8);      
    	} 	
   	     
    	//Skapar "svars"-rutorna  " _ _ _ _"
    	for (var i = 0; i < wordtoguess.length; i++)
    	{
		displaytext += " ";
        	displaytext += "_";
     	}
		
  	/*Användaren får fortsätta spelet medan du har fler än 0 försök,
  	vinner spelet om du lyckas gissa fram ordet
  	förlorar spelet om du får slut på försök */
	while (lives > 0)
	{
		UpdateGUI();	//Uppdateras efter varje gissning
		MakeAGuess();
          
          	if (letterslefttoguess === 0)
        	{
          		Victory();
              		break;
       		}
	}
      	if (lives < 1)
        {
		Defeat();
        }
   
}

//Användaren får gissa på ett helt ord eller på en bokstav
function MakeAGuess()
{
	let askedletter = prompt("Gissa en bokstav eller ett ord");
  	
  	if (askedletter != null)
    	{
              
		//Användaren gissar på ett helt ord, måste då exakt matcha det rätta ordet
		if (askedletter.length > 1)
		{
			if (askedletter === wordtoguess)
		    	{
				letterslefttoguess = 0;  
		    	}
			else
		    	{
				lives = lives - 1 * loselivesfactor;
		    	}
		}
      	
      		//Användaren gissar på en bokstav
		if (askedletter.length === 1)
        	{
              		var givepenalty = true;

              		//Användaren får inte avdrag om du redan gissat på bokstaven tidigare
              		var alreadyinlist = false;
              		for (var i = 0; i < alreadyguessedletters.length; i++)
              		{
                      if (alreadyguessedletters[i] === askedletter.charAt(0))
                      {
                          givepenalty = false;
                          alreadyinlist = true
                          break;
                      }
              		}

		      //Gissar anändaren rätt avslöjas motsvarande ruta(or) till bokstavens plats(er) i ordet på skärmen
		      for (var i = 0; i < wordtoguess.length; i++)
		      {
		      		//Platsen för motsvarande ruta till bokstavens index i ordet, är 2i + 1 (där i är indexet)
				if (askedletter.charAt(0) === wordtoguess.charAt(i) && !alreadyinlist)
			  	{
			    		displaytext = displaytext.substr(0, (2*i + 1)) + askedletter.charAt(0) + displaytext.substr(2*i + 2);
			    		letterslefttoguess = letterslefttoguess - 1;
			    		givepenalty = false;
			  	}

			}
					//Lägger till den gissade bokstaven i en lista av gissade bokstäver
              		if (!alreadyinlist)
              		{
                  		alreadyguessedletters.push(askedletter.charAt(0));              
			}
              		//Användaren förlorar ett liv om den blivit flaggad för ett avdrag
              		if (givepenalty)
              		{
                  		lives = lives - 1 * loselivesfactor;
              		}

          
        	}
    	}
  	else
    {
    //Bekräftningsfönster för om användaren vill avsluta spelet
    let askedletter = prompt("Är du säker på att vill avsluta spelet? (Klicka på OK för att stänga ner spelet)"); 
     switch(askedletter)
      {
        default:
          	lives = 0;
          	return;
        case null:
        	break;
      }
    }
  
}

//Ritar/uppdaterar grafiken på skärmen
function UpdateGUI()
{
  	clearScreen();
	text(totalWidth - totalWidth, totalHeight/2 + 364 * scalesizefactorY,  scalesizefactoranswerbox, displaytext, screentextcolor);
  	text(totalWidth - 1841 * scalesizefactorX, totalHeight - totalHeight + 50 * scalesizefactorY, 70 * scalesizefactor1D, "Letters already guessed: " + alreadyguessedletters, 'green'); 
  	text(totalWidth - 1841 * scalesizefactorX, totalHeight - totalHeight + 150 * scalesizefactorY, 140 * scalesizefactor1D, "Lives left: " + ceil(lives / loselivesfactor), 'purple');
  	
  	switch(lives)
    {     
      case 1: //Gör gubben röd
        hangmancolor = 'red';
      case 2: //Rött hav
		rectangle(1200 * scalesizefactorX, 462 * scalesizefactorY, 600, 100, 'red');
      case 3: //Höger ben
        line(1770 * scalesizefactorX, 314 * scalesizefactorY, 1852 * scalesizefactorX, 369 * scalesizefactorY, 25 * scalesizefactor1D, hangmancolor);
      case 4: //Vänster ben
        line(1770 * scalesizefactorX, 314 * scalesizefactorY, 1689 * scalesizefactorX, 369 * scalesizefactorY, 25 * scalesizefactor1D, hangmancolor);
      case 5: //Höger arm
        line(1770 * scalesizefactorX, 166 * scalesizefactorY, 1852 * scalesizefactorX, 234 * scalesizefactorY, 25 * scalesizefactor1D, hangmancolor);
      case 6: //Vänster arm
        line(1770 * scalesizefactorX, 166 * scalesizefactorY, 1689 * scalesizefactorX, 234 * scalesizefactorY, 25 * scalesizefactor1D, hangmancolor);
      case 7: //Rita gubbens kropp
         line(1770 * scalesizefactorX, 148 * scalesizefactorY, 1770 * scalesizefactorX, 314 * scalesizefactorY, 25 * scalesizefactor1D, hangmancolor);
      case 8: //Rita huvud på gubbe
        circle(1770 * scalesizefactorX, 129 * scalesizefactorY, 74 * scalesizefactor1D, hangmancolor);
      case 9: //Rita högra ögat
        circle(1780 * scalesizefactorX, 129 * scalesizefactorY, 7, 'white');
        circle(1780 * scalesizefactorX, 129 * scalesizefactorY, 3, 'red');
      case 10: //Rita vänstra ögat
        circle(1740 * scalesizefactorX, 129 * scalesizefactorY, 7, 'white');
        circle(1740 * scalesizefactorX, 129 * scalesizefactorY, 3, 'red');
      case 11: //Stöd mellan horisontell och vertikal stomme av galjen
      	line(1430 * scalesizefactorX, 185 * scalesizefactorY, 1590 * scalesizefactorX, 92 * scalesizefactorY, 30 * scalesizefactor1D, 'brown');
      case 12: //Horisontell stomme av galjen 
        line(1430 * scalesizefactorX, 92 * scalesizefactorY, 1770 * scalesizefactorX, 92 * scalesizefactorY, 75 * scalesizefactor1D, 'brown');
      case 13: //Vertikal stomme av galjen
      	line(1430 * scalesizefactorX, 462 * scalesizefactorY, 1430 * scalesizefactorX, 92 * scalesizefactorY, 75 * scalesizefactor1D, 'brown');
      case 14: //Har förlorat ett liv. Rita grön kulle
      	arc(1430 * scalesizefactorX, 462 * scalesizefactorY, 251 * scalesizefactor1D, 180, 101 * scalesizefactor1D, 'green');
      case 'default':
        break;
    }
}

//Presenterar att du vunnit spelet
function Victory()
{	
	clearScreen();
  	screentextcolor = 'black';
	text(totalWidth - 1571 * scalesizefactorX, totalHeight/2, 250 * scalesizefactor1D, "You win!", screentextcolor);
}

//Presenterar att du förlorat spelet
function Defeat()
{	
	clearScreen();
  		screentextcolor = 'red';
		text(totalWidth - 1571 * scalesizefactorX, totalHeight/2, 250 * scalesizefactor1D, "You lose!", screentextcolor);  
  		hangmancolor = 'red';
  		//Samma kod som vid switch(lives) tidigare. Se där för förklaring.
        line(1770 * scalesizefactorX, 314 * scalesizefactorY, 1852 * scalesizefactorX, 369 * scalesizefactorY, 25 * scalesizefactor1D, hangmancolor);
        line(1770 * scalesizefactorX, 166 * scalesizefactorY, 1689 * scalesizefactorX, 234 * scalesizefactorY, 25 * scalesizefactor1D, hangmancolor);
        line(1770 * scalesizefactorX, 148 * scalesizefactorY, 1770 * scalesizefactorX, 314 * scalesizefactorY, 25 * scalesizefactor1D, hangmancolor);
        line(1770 * scalesizefactorX, 314 * scalesizefactorY, 1689 * scalesizefactorX, 369 * scalesizefactorY, 25 * scalesizefactor1D, hangmancolor);
        line(1770 * scalesizefactorX, 166 * scalesizefactorY, 1852 * scalesizefactorX, 234 * scalesizefactorY, 25 * scalesizefactor1D, hangmancolor);
        circle(1770 * scalesizefactorX, 129 * scalesizefactorY, 74 * scalesizefactor1D, hangmancolor);
        circle(1780 * scalesizefactorX, 129 * scalesizefactorY, 7, 'white');
        circle(1780 * scalesizefactorX, 129 * scalesizefactorY, 3, 'red');
        circle(1740 * scalesizefactorX, 129 * scalesizefactorY, 7, 'white');
        circle(1740 * scalesizefactorX, 129 * scalesizefactorY, 3, 'red');
      	line(1430 * scalesizefactorX, 185 * scalesizefactorY, 1590 * scalesizefactorX, 92 * scalesizefactorY, 30 * scalesizefactor1D, 'brown');
        line(1430 * scalesizefactorX, 92 * scalesizefactorY, 1770 * scalesizefactorX, 92 * scalesizefactorY, 75 * scalesizefactor1D, 'brown');
      	line(1430 * scalesizefactorX, 462 * scalesizefactorY, 1430 * scalesizefactorX, 92 * scalesizefactorY, 75 * scalesizefactor1D, 'brown');
      	arc(1430 * scalesizefactorX, 462 * scalesizefactorY, 251 * scalesizefactor1D, 180, 101 * scalesizefactor1D, 'green');

  		alert("Correct word was: " + wordtoguess);
  
}  

</script>
