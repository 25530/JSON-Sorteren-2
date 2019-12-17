
let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
   if (this.readyState == 4 && this.status == 200) {
      sorteerland.data = JSON.parse(this.responseText);
      sorteerland.voegJSDatumtoe();


      sorteerland.data.forEach(land => {
         land.titelKap = land.titel.toUpperCase();
        
         land.sorteerAuteur = land.auteur[0];
      })
      sorteerland.sorteren();
   }
}
xmlhttp.open("GET", "landen.json", true);
xmlhttp.send();


const TabelKop = (arr) => {
   let kop = "<table class='landSelectie'><tr>";
   arr.forEach((item) => {
      kop += "<th>" + item + "</th>";
   })
   kop += "</tr>";
   return kop;
}



const opsomming = (array) => {
   let string = "";
   for (let i = 0; i < array.length; i++) {
      switch (i) {
         case array.length - 1:
            string += array[i];
            break;
         case array.length - 2:
            string += array[i] + " en ";
            break;
         default:
            string += array[i] + ", ";
      }
   }
   return string;
}


const geefMaandNummer = (maand) => {
   let nummer;
   switch (maand) {
      case "januari":
         nummer = 0;
         break;
      case "februari":
         nummer = 1;
         break;
      case "maart":
         nummer = 2;
         break;
      case "april":
         nummer = 3;
         break;
      case "mei":
         nummer = 4;
         break;
      case "juni":
         nummer = 5;
         break;
      case "juli":
         nummer = 6;
         break;
      case "augustus":
         nummer = 7;
         break;
      case "september":
         nummer = 8;
         break;
      case "oktober":
         nummer = 9;
         break;
      case "november":
         nummer = 10;
         break;
      case "december":
         nummer = 11;
         break;

      default:
         nummer = 0
         break;
   }
   return nummer;
}


const VoegJSDatum = (maandJaar) => {
   let mjArray = maandJaar.split(" ");
   let datum = new Date(mjArray[1], geefMaandNummer(mjArray[0]));
   return datum;
}


const keerTekstOm = (string) => {
   if (string.indexOf(',') != -1) {
      let array = string.split(',');
      string = array[1] + ' ' + array[0];
   }
   return string;
}

let winkelwagen = {
   items: [],

   haalProductenOp: function() {
      let bestelling;
      if(localStorage.getItem('besteldelanden')== null) {
         bestelling = [];
      }
      else {
         bestelling = JSON.parse(localStorage.getItem('besteldelanden'));
         bestelling.forEach(item => {
            this.items.push(item);
         })
         this.uitvoeren();
      }
      return bestelling;
   },
   toevoegen: function (el) {
      this.items = this.haalProductenOp();
      this.items.push(el);
      localStorage.setItem('besteldelanden', JSON.stringify(this.items));
      this.uitvoeren();
   },

   uitvoeren: function() {
      if(this.items.length > 0) {
         document.querySelector('.winkelwagen__aantal').innerHTML = this.items.length;
      }
      else {
         document.querySelector('.winkelwagen__aantal').innerHTML = "";
      }
   }
}

winkelwagen.haalProductenOp();

let sorteerland = {
   data: "", 

   kenmerk: "titelKap",

   lopend: 1,

   voegJSDatumtoe: function () {
      this.data.forEach((item) => {
         item.Datums = VoegJSDatum(item.uitgave);
      });
   },

   sorteren: function () {
      this.data.sort((a, b) => a[this.kenmerk] > b[this.kenmerk] ? 1 * this.lopend : -1 * this.lopend);
      this.uitvoeren(this.data);
   },


   uitvoeren: function (data) {

      document.getElementById('uitvoer').innerHTML = "";
      data.forEach(land => {
         let sectie = document.createElement('section');
         sectie.className = 'landSelectie';
 
         let main = document.createElement('main');
         main.className = 'landSelectie__main';

 
         let afbeelding = document.createElement('img');
         afbeelding.className = 'landSelectie__cover';
         afbeelding.setAttribute('src', land.cover);
         afbeelding.setAttribute('alt', keerTekstOm(land.titel));

         let titel = document.createElement('h3');
         titel.className = 'landSelectie__titel';
         titel.textContent = keerTekstOm(land.titel);


         let auteurs = document.createElement('p');
         auteurs.className = 'landSelectie__auteurs';

         land.auteur[0] = keerTekstOm(land.auteur[0]);
 
         auteurs.textContent = opsomming(land.auteur);

         let overig = document.createElement('p');
         overig.className = 'landSelectie__overig';
         overig.textContent = 'datum van onafhankelijkheid: ' + land.uitgave + ' | Bevolking: ' + land.paginas + ' | taal: ' + land.taal + ' | land-code: ' + land.ean;

   
         let prijs = document.createElement('div');
         prijs.className = 'landSelectie__prijs';
         prijs.textContent = land.prijs.toLocaleString('nl-NL', {
            currency: 'EUR',
            style: 'currency'
         });


         let button = document.createElement('button');
         button.className = 'landSelectie__button';
         button.innerHTML = 'Voeg toe aan<br>winkelwagen';
         button.addEventListener('click', () => {
            winkelwagen.toevoegen(land);
         })

      
         sectie.appendChild(afbeelding);
         main.appendChild(titel);
         main.appendChild(auteurs);
         main.appendChild(overig);
         sectie.appendChild(main);
         prijs.appendChild(button)
         sectie.appendChild(prijs);
         document.getElementById('uitvoer').appendChild(sectie);
      });

   }
}


let kenmerk = document.getElementById('kenmerk').addEventListener('change', (e) => {
   sorteerland.kenmerk = e.target.value;
   sorteerland.sorteren();
});

document.getElementsByName('lopend').forEach((item) => {
   item.addEventListener('click', (e) => {
      sorteerland.lopend = parseInt(e.target.value);
      sorteerland.sorteren();
   })
})
