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
void MatsSort(int Array[], int Array_Size)
{
    clock_t t0 = clock();
    int tempArray[Array_Size];

    //Kopiera originalarrayen till en ny lista att lagra informationen i
    for (int i = 0; i < Array_Size;)
    {
        tempArray[i] = Array[i];
        i++;
    }

    int indexOfElement;

    //Lägg till största elementen i fel ordning tillbaka
    for (int i = Array_Size-1; i >= 0; i = i - 1)
    {
        indexOfElement = 0;
        //Söker igenom arrayen efter dess största element
        for (int j = 1; j < Array_Size; j++)
        {
            if (tempArray[j] > tempArray[indexOfElement])
            {
                indexOfElement = j;
            }
        }
        Array[i] = tempArray[indexOfElement]; //Elementet på plats i sätts till det största hittade elementet
        tempArray[indexOfElement] = INT_MIN;    //Sätter största hittade elementet till minsta talet som finns (undvika stöta på igen)
    }
    clock_t t1 = clock();
    executionTime = (double)(t1-t0) / CLOCKS_PER_SEC;
}

//Sorterar en lista genom principen att flytta fram lägre tal i listan (till lägre index)
void InsertionSort(int Array[], int Array_Size)
{
    clock_t t0 = clock();
    int storedint;
    int j;

    //Varje tal i listan jämförs med tidigare tal i listan
    for (int i = 0; i < Array_Size; i++)
    {
        storedint = Array[i];
        j = i - 1;

        //Flytta fram talet en plats varje gång ett tidigare tal i listan är större (utbyt talen med varandra)
        while (j >= 0 && storedint < Array[j])
        {
            Array[j+1] = Array[j];
            j = j - 1;
        }
        Array[j+1] = storedint;
    }

    clock_t t1 = clock();
    executionTime = (double)(t1-t0) / CLOCKS_PER_SEC;
}

//Skriver ut innehållet i en array
void PrintList(int Array[], int Array_Size)
{
    printf("Array -- SIZE: %d\n", Array_Size);
    for (int i = 0; i < Array_Size; i++)
    {
        printf("ID %d value: %d\n", i, Array[i]);
    }
    printf("------------\n");
}

//Genererar element till en array av given storlek
void GenerateArray(int Array[], int Array_Size)
{
    for (int i = 0; i < Array_Size; i++)
    {
        Array[i] = rand() % MAX_NUMSIZE;
    }
}






