#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
#include <time.h>

/*
 (a) MatsSort(): Skriv ett program som sorterar en lista med tal.
        Använd Mats förslag där man letar upp det största värdet i en lista
        och lägger det till ”sorteringslista” och sedan tar bort talet från ursprungslistan.
 (b) InsertionSort(): Skriv ett program baserat på en annan sorteringsalgoritm.
 (c) Jämför dessa med c's inbyggda qsort().
*/

//Program som sorterar en lista//

//Konfig
int MAX_NUMSIZE = 51;      //Maximala storleken blir denna - 1 på talen som slumpas fram
double executionTime;

int main()
{
    //Kompilatorn kräver implicita deklarationer av funktioner i programmet
    void GenerateArray();
    void MatsSort();
    void PrintList();
    void InsertionSort();
    void qsort(void *base, size_t nitems, size_t size, int (*compar)(const void *, const void*));
    int comparefunction();

    int Array_Size;
    printf("Enter size of array you want to create: \n");
    scanf("%d", &Array_Size);
    printf("Roger that. Array size set to: %d\n", Array_Size);
    int* Array = malloc(Array_Size*sizeof(int));
    int selectedSortingAlgorithm = 1;

    GenerateArray(Array, Array_Size);
    PrintList(Array, Array_Size);

    printf("\nEnter which sorting algorithm you want to use: \n1 for Matssort, 2 for Insertionsort, 3 for qsort\n");
    scanf("%d", &selectedSortingAlgorithm);

    clock_t t0 = clock();
    switch (selectedSortingAlgorithm)
    {
        case 1:
            MatsSort(Array, Array_Size);
            break;
        case 2:
            InsertionSort(Array, Array_Size);
            break;
        case 3:
            qsort(Array, Array_Size, sizeof(Array[0]), comparefunction);
            break;
        default:
            printf("Sorry, either that value is not possible, or you have not entered a value. Please retry");
            break;
    }
            clock_t t1 = clock();
            executionTime = (double)(t1-t0) / CLOCKS_PER_SEC;

    PrintList(Array, Array_Size);

    printf("Execution time %f s\n", executionTime);
    free(Array);
    return 0;
}



//Funktion som sorterar listan enligt Mats princip (ta ut största elementet)
void MatsSort(int Array[], int Array_Size)
{
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
        for (int j = 0; j < Array_Size; j++)
        {
            if (tempArray[j] > tempArray[indexOfElement])
            {
                indexOfElement = j;
            }
        }
        Array[i] = tempArray[indexOfElement]; //Elementet på plats i sätts till det största hittade elementet
        tempArray[indexOfElement] = INT_MIN;    //Sätter största hittade elementet till minsta talet som finns (undvika stöta på igen)
    }

}



//Sorterar en lista genom principen att flytta fram lägre tal i listan (till lägre index)
void InsertionSort(int Array[], int Array_Size)
{
    int storedint;
    int j;

    //Varje tal i listan jämförs med tidigare tal i listan

    for (int i = 1; i < Array_Size; i++)
    {
        storedint = Array[i];
        j = i - 1;

        //Flytta fram större tal i listan
        while (j >= 0 && storedint < Array[j])
        {
            Array[j+1] = Array[j];    //Flyttar fram det tidigare talet en plats
            j = j - 1;
        }
        Array[j+1] = storedint;
    }

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

//C's inbyggda quicksort kräver en funktion som utför jämförelse mellan två elements storlekar
int comparefunction (const void *a, const void *b)
{
   return ( *(int*)a - *(int*)b );
}



