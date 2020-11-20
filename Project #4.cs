using UnityEngine;

//Skript som skapar ett rutnät, placerar det på marknivå och lagrar information om det
//Kräver 2 komponenter: "Meshfilter" och "Meshrender"
/*Meshfilter lagrar informationen om meshen (ex positionerna för hörnen/ytorna mellan dem)
 Meshrenderern ritar meshen baserat på instruktionerna/mallen från Meshfiltret
 Minst ett material måste vara tillagt i Meshrenderern i inspekteraren för att den ska kunna rita föremålet */
 
//Lägger till komponenterna "Meshfilter" och "Meshrenderer" till objektet om de inte finns
[RequireComponent(typeof(MeshFilter), typeof(MeshRenderer))]	

[ExecuteInEditMode]	//Gör att skriptet körs i redigeraren (annars körs det enbart under runtime)					 


public class Grid : MonoBehaviour
{
	//Konfig
	public int xSize, ySize;					//Sätts i Unity-inspekteraren till 50 och 50
	public float groundOffset = 0.01f;
	public int cellSize; //Sätts i unity-inspekteraren, annars 1 per default.
	public Mesh mesh;
	
	//Den ska enbart skapa rutnätet under edit-mode, ej under runtime
	#if UNITY_EDITOR
	public void OnEnable() 				
	{		

		MeshRenderer meshRenderer = gameObject.GetComponent<MeshRenderer>();
		//Kontroll som lägger till ett material till rutnätet om du inte redan gjort det
		if (meshRenderer.sharedMaterial == null)
		{
			
			Debug.Log("<color=red>Warning, no material has been assigned for Grid with ID: </color>" + this.gameObject.GetInstanceID() + ", located at: " + this.gameObject.transform.position + "");		
			return;
		}
		if (xSize <= 0 || ySize <= 0)
		{
			Debug.Log("<color=red>Warning, no xSize or ySize has been assigned for Grid with ID: </color>" + this.gameObject.GetInstanceID() + ", located at: " + this.gameObject.transform.position + "");
			Debug.Log("Assigning 50*50 as default");
			xSize = 50;
			ySize = 50;
		}
		if (cellSize <= 0)
		{
			Debug.Log("Warning, no cellSize has been assigned for Grid with ID: </color>" + this.gameObject.GetInstanceID() + ", located at: " + this.gameObject.transform.position + "");
			Debug.Log("Assigning 1 as default");
			cellSize = 1;
		}
		
		Generate();
		AlignWithGround();	
		Resources.UnloadUnusedAssets(); 	//Förhindra att meshar läcker
		
	}
	#endif

	// Datatype som representerar en ruta
	// denna klass kommer i framtiden lagra data om vilket golv (om något alls) som rutan har
	// och om villka föremål som finns på rutan	förmål som finns placerat på rutan.
	public class GridTile 
	{
		int relativeX;
		int relativeY;
		Vector3 worldCoordinate;
		
		public GridTile(int relX, int relY, Vector3 worldCoord)
		{
			relativeX = relX;
			relativeY = relY;
			worldCoordinate = worldCoord;
		}
		
		//Get-funktion som hämtar världskoordinaten för angivet hörn
		public Vector3 getRealPos()
		{
			return worldCoordinate;
		}
		
		//Plats för framtida expansion, exempelvis lägga till textures
		
	}		
					
	//Lagra information om väggarna runt varje ruta (4 st/ruta)
	public class GridWall	
	{
		int relativeX;
		int relativeY;
		bool hasWall = false;
		Vector3 position;
		
		public GridWall(int relX, int relY, Vector3 pos)
		{
			relativeX = relX;
			relativeY = relY;
			position = pos;
		}
		
		//Set-funktion för att sätta boolen hasWall
		public void setToContainWall(bool hasWall)
		{
			this.hasWall = hasWall;
		}
		
		//Get-funktion som returnerar värdet av boolen hasWall
		public bool getHasWall()
		{
			return hasWall;
		}
		
		//Get-funktion som returnerar objekets position i världen
		public Vector3 getRealPos()
		{
			return position;
		}
		
		//Plats för framtida expansion
		
	}
	
	
	//Lägger rutnätet groundOffset (per default: 0.01 enheter) över markytan mha av en raycast 
	//Notis: RayCastHit en inbyggd datastruct i Unity, registrerar om vi träffar något objekt (och information om objektet vi träffar)
	public void AlignWithGround()
	{	
		//Skicka ut en stråle nedåt
		RaycastHit hit;						
        Ray downRay = new Ray(transform.position, -Vector3.up);		
		
		//Om denna stråle träffar marken så flyttas hela rutnätet till att vara groundOffset över denna
		if (Physics.Raycast(downRay, out hit))					
        {
			this.transform.Translate (0, groundOffset - hit.distance, 0);	
		}
	}
	
	//Deklarera dessa variabler globala
	public Vector3[] vertices;
	public Vector2[] uvmaps;
	public Vector4[] tangents;	
	
	// 
	public GridTile[,] tiles;	
	public GridWall[,] horizontalwalls;
	public GridWall[,] verticalwalls;
	
	//Genererar meshen (som är formen av 3D-objektet)
	
	public void Generate()
	{
		
		//Skapar en ny, tom mesh med namnet "Grid Mesh"
		mesh = GetComponent<MeshFilter>().mesh = new Mesh();					
		mesh.name = "Grid Mesh";
		
		//Sätter storleken på arrayerna som ska lagra informationen om rutnätet
		vertices = new Vector3[(xSize + 1)*(ySize + 1)];	
		uvmaps = new Vector2[vertices.Length];				//Låter oss färglägga enskilda rutor av rutnätet senare
		tangents = new Vector4[vertices.Length];			//Möjliggör användning av shaders som ger en illusion av ojämn yta "bump-maps" 
		Vector4 tangent = new Vector4(1f, 0f, 0f, -1f);		//Tangent orienterad i horisontell riktning längs våra UV-koordinater
		
		tiles = new GridTile[xSize+1, ySize+1]; 							
		horizontalwalls = new GridWall[xSize, ySize*2];
		verticalwalls = new GridWall[xSize, ySize*2];
		
		//Generera ett hörn för varje heltals x,y-koordinat i rutnätet. Detta är viktigt för att unity ska kunna rita rutätet
		// (Obs: körs 1 gång "för mycket", för att sista raden rutor inte ska bli utan hörn)
		int currentVertexIndex = 0;	
		for (int y = 0; y <= ySize; y++) 
		{
			for (int x = 0; x <= xSize; x++)  		
			{											
				//Ett nytt hörn skapas och läggs in i listan
				vertices[currentVertexIndex] = new Vector3(x*cellSize, 0f, y*cellSize); 		
				
				//Lägger till alla rutor men skippar detta på de extra, sista raderna
				if (x != xSize && y != ySize)		
				{
					tiles[x, y] = new GridTile(x, y, this.transform.TransformPoint(vertices[currentVertexIndex]));
				}
				
				//Texturkoordinater och bump-maps för varje hörn
				uvmaps[currentVertexIndex] = new Vector2((float)x / xSize, (float)y / ySize);
				tangents[currentVertexIndex] = tangent;

				currentVertexIndex++;
			}
		}
			
		//Sätter in dessa värden i meshen
		mesh.vertices = vertices;		
		mesh.uv = uvmaps;				
		mesh.tangents = tangents;	

		// Placera en "tom" vägg på varje plats på tomten.
		for (int y = 0; y <= ySize; y++)
		{
			for (int x = 0; x < xSize; x++)
			{
				// skapa tom horisontell och vertikal vägg på koordinaty x,y
				horizontalwalls[x,y] = new GridWall(x,y, this.transform.TransformPoint(new Vector3((x +((float)cellSize/2)), 0, y)));
				verticalwalls[x,y] = new GridWall(x,y, this.transform.TransformPoint(new Vector3(x, 0, y +((float)cellSize/2))));
			}
		}
		
		
		//Generera rut-ytorna (bestående av trianglar) mellan hörnen
		
		// Variablen "triangles" innehåller alla "trianglar", (men egentligen alla triangelhörn).
		// Varje grupp om tre element i denna array representerar en triangel.
		// triangles[0], triangles[1] och triangles[2] bildar alltså den första triangeln, [3] [4] och [5] den andra och så vidare.
		
		int[] triangles = new int[xSize * ySize * 6]; // Varje ruta har två trianglar, som var och en har tre hörn ( alltså behövs 2*3=6 triangelhörn per ruta)				
		for (int triangleindex = 0, vertexindex = 0, y = 0; y < ySize; y++, vertexindex++)
		{
			for (int x = 0; x < xSize; x++, triangleindex += 6, vertexindex++)
			{
				// Varje ruta i rutnätet ska representeras av två likbenta rätvinkliga trianglar.
				// För att skapa dessa 2 trianglar måste 6 triangelhörn läggas till i triangels:
				// 3 st. för triangeln top-left i rutan, och tre för triangeln bottom-right i rutan.
				
				// Hitta hörnen till den nuvarande RUTAN; dessa används för att skapa trianglarna.
				int topLeftCorner = vertexindex;
				int topRightCorner = vertexindex + 1;
				int botLeftCorner = vertexindex + xSize + 1; // genom att lägga till xSize+1 kommer den till nästa rads vertex
				int botRightCorner = vertexindex + xSize + 2;
				
				// SKAPA TRIANGEL ETT UPP I VÄNSTRA HÖRNET
				triangles[triangleindex] = topLeftCorner; // Första hörnet i första trianglen är rutans top-left.
				triangles[triangleindex + 1] = botLeftCorner;
				triangles[triangleindex + 2] = topRightCorner;
				
				// SKAPA TRIANGEL TVÅ NERE I HÖGRA HÖRNET
				triangles[triangleindex + 3] = topRightCorner;
				triangles[triangleindex + 4] = botLeftCorner;
				triangles[triangleindex + 5] = botRightCorner;
			}
			
		}
		
		//Sätt in genererade triangeldatan i meshen, så att trianglarna kan ritas upp
		mesh.triangles = triangles;
		
		mesh.RecalculateNormals(); // Detta gör att Unity beräknar nya "normals" för meshen, som inkluderar trianglarna.
		// "Normals" är viktiga för ljusbereäkningar med meshen, så det är bra att uppdatera när man ändrat meshen.
		
	}
			
}
