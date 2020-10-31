#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
#include <time.h>
/*
 (a) MatsSort(): Skriv ett program som sorterar en lista med tal.
        Använd Mats förslag där man letar upp det största värdet i en lista
        och lägger det till ”sorteringslista” och sedan tar bort talet från ursprungslistan.
 (b) InsertionSort(): Skriv ett program baserat på en annan sorteringsalgoritm.
 (c) Jämför dessa med Pythons list.sort().

 Jämför hur effektiv denna variant är för att sortera stora listor (tex slumptalslistor) jämfört med den i den förra uppgiften samt den inbyggda funktionen lista.sort(). Ett sätt att mäta hur ”bra” en algoritm är är att räkna antalet operationer som utförs. Du kan t.ex. räkna antalet jämförelser som krävs för en sortering Ett annat alternativ är att mäta exekveringstiden, tex med funktionen time.process_time() som skriver ut gången tid  i sekunder. För en variant som kan vara effektiv i stora slumptalslistor, se nedan… Andra alternativ är att söka andra rutiner såsom bubblesort, heapsort m.m. (A)
*/

//Program som sorterar en lista//

//Konfig
int MAX_NUMSIZE = 51;      //Maximala storleken blir denna - 1 på talen som slumpas fram
double executionTime;  //deklarera global

int main()
{
    //Kompilatorn kräver implicita deklarationer av funktioner i programmet
    void GenerateArray();
    void MatsSort();
    void PrintList();
    void InsertionSort();

    int Array_Size;
    printf("Enter size of array you want to create: \n");
    scanf("%d", &Array_Size);
    printf("Roger that. Array size set to: %d\n", Array_Size);
    int Array[Array_Size];

    GenerateArray(Array, Array_Size);
    PrintList(Array, Array_Size);

    //Byt ut "MatsSort()" mot "InsertionSort()" för att ändra använd sorteringsalgoritm
    MatsSort(Array, Array_Size);

    PrintList(Array, Array_Size);

    printf("Execution time %f s\n", executionTime);
    return 0;
}



//Funktion som sorterar listan enligt Mats princip (ta ut största elementet)
void MatsSort(int l_Array[], int l_Array_Size) //"l_" för att variabeln är lokal (undvika förvirring)
{
    clock_t t0 = clock();
    int tempArray[l_Array_Size];

    //Kopiera originalarrayen till en ny lista att lagra informationen i
    for (int i = 0; i < l_Array_Size;)
    {
        tempArray[i] = l_Array[i];
        i++;
    }

    int l_indexOfElement;   

    //Lägg till största elementen i fel ordning tillbaka
    for (int i = l_Array_Size-1; i >= 0; i = i - 1)
    {
        l_indexOfElement = 0;
        //Söker igenom arrayen efter dess största element
        for (int j = 0; j < l_Array_Size; j++)
        {
            if (tempArray[j] > tempArray[l_indexOfElement])
            {
                l_indexOfElement = j;
            }
        }
        l_Array[i] = tempArray[l_indexOfElement]; //Elementet på plats i sätts till det största hittade elementet
        tempArray[l_indexOfElement] = INT_MIN;    //Sätter största hittade elementet till minsta talet som finns (undvika stöta på igen)
    }
    clock_t t1 = clock();
    executionTime = (double)(t1-t0) / CLOCKS_PER_SEC;
}

//Sorterar en lista genom principen att flytta fram lägre tal i listan (till lägre index)
void InsertionSort(int l_Array[], int l_Array_Size)
{
    clock_t t0 = clock();
    int storedint;
    int j;

    //Varje tal i listan jämförs med tidigare tal i listan
    for (int i = 1; i < l_Array_Size; i++)
    {
        storedint = l_Array[i];
        j = i - 1;

        //Flytta fram talet en plats varje gång ett tidigare tal i listan är större (utbyt talen med varandra)
        while (j >= 0 && storedint < l_Array[j])
        {
            l_Array[j+1] = l_Array[j];
            j = j - 1;
        }
        l_Array[j+1] = storedint;
    }

    clock_t t1 = clock();
    executionTime = (double)(t1-t0) / CLOCKS_PER_SEC;
}

//Skriver ut innehållet i en array
void PrintList(int l_Array[], int l_Array_Size)
{
    printf("Array -- SIZE: %d\n", l_Array_Size);
    for (int i = 0; i < l_Array_Size; i++)
    {
        printf("ID %d value: %d\n", i, l_Array[i]);
    }
    printf("------------\n");
}

//Genererar element till en array av given storlek
void GenerateArray(int l_Array[], int l_Array_Size)
{
    for (int i = 0; i < l_Array_Size; i++)
    {
        l_Array[i] = rand() % MAX_NUMSIZE;
    }
}






