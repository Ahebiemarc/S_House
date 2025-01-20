import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const TipsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Section 1: Conseils pour les hôtes */}
      <View style={styles.section}>
        <Text style={styles.title}>Conseils pour les hôtes</Text>
        
        <Text style={styles.subtitle}>1. Bien préparer une maison pour les locataires</Text>
        <Image
          source={{ uri: 'https://plus.unsplash.com/premium_photo-1676823547752-1d24e8597047?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWFpc29uJTIwcHJvcHJlfGVufDB8fDB8fHww' }} // Remplace par ton URL
          style={styles.image}
        />
        <Text style={styles.text}>
          Assurez-vous que votre maison est propre et bien entretenue. Fournissez des commodités 
          comme du linge de maison propre, des articles de toilette et une connexion Wi-Fi fiable.
        </Text>

        <Text style={styles.subtitle}>2. Rédiger une description attractive</Text>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
          style={styles.image}
        />
        <Text style={styles.text}>
          Soyez clair et honnête. Mentionnez les points forts de votre logement, 
          comme sa proximité des transports ou des attractions locales.
        </Text>

        <Text style={styles.subtitle}>3. Fixer des prix compétitifs</Text>
        <Text style={styles.text}>
          Adaptez vos tarifs en fonction des saisons, des jours fériés ou des événements locaux.
          Proposez des réductions pour des séjours de longue durée.
        </Text>
      </View>

      {/* Section 2: Conseils pour les locataires */}
      <View style={styles.section}>
        <Text style={styles.title}>Conseils pour les locataires</Text>

        <Text style={styles.subtitle}>1. Choisir un logement adapté</Text>
        <Image
          source={{ uri: 'https://plus.unsplash.com/premium_photo-1680300960759-7afa8664efee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
          style={styles.image}
        />
        <Text style={styles.text}>
          Définissez vos besoins : emplacement, nombre de chambres, commodités. Lisez les descriptions 
          et examinez attentivement les photos.
        </Text>

        <Text style={styles.subtitle}>2. Éviter les arnaques</Text>
        <Text style={styles.text}>
          Vérifiez les profils des hôtes, les avis et la note globale du logement. Ne faites jamais de 
          transactions en dehors de l'application pour votre sécurité.
        </Text>

        <Text style={styles.subtitle}>3. Critères importants</Text>
        <Text style={styles.text}>
          Lors de la visite ou avant de réserver, vérifiez l'état général du logement, 
          les équipements et les conditions spécifiques (comme les règles de séjour).
        </Text>
      </View>

      {/* Section 3: Conseils pour les étudiants */}
      <View style={styles.section}>
        <Text style={styles.title}>Conseils pour les étudiants</Text>
        <Text style={styles.subtitle}>1. Trouver une maison pour la rentrée scolaire</Text>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8VHJvdXZlciUyMHVuZSUyMG1haXNvbiUyMHBvdXIlMjBsYSUyMHJlbnRyJUMzJUE5ZSUyMHNjb2xhaXJlfGVufDB8fDB8fHww' }} // Remplace par ton URL
          style={styles.image}
        />
        <Text style={styles.text}>
          Si vous êtes étudiant venant d'une autre ville, commencez vos recherches tôt. 
          Recherchez des logements proches de votre université ou des transports publics pour plus de praticité.
        </Text>
        <Text style={styles.subtitle}>2. Prévoir les documents nécessaires</Text>
        <Text style={styles.text}>
          Assurez-vous d'avoir tous les documents nécessaires, comme une preuve d'inscription à l'université 
          ou une lettre de garant, pour faciliter le processus de location.
        </Text>
      </View>

      {/* Section 4: FAQs et règles */}
      <View style={styles.section}>
        <Text style={styles.title}>FAQs et règles</Text>
        <Text style={styles.text}>
          {`-Que se passe-t-il si je dois annuler une réservation ?\n**Consultez les politiques d'annulation disponibles dans l'application.`}

          {`\n-Comment signaler un problème ?\n**Utilisez l'option "Support" dans votre profil pour contacter notre équipe.`}
        </Text>
      </View>

      {/* Section 5: Sécurité et conformité */}
      <View style={styles.section}>
        <Text style={styles.title}>Sécurité et conformité</Text>
        <Text style={styles.text}>
          Toutes les transactions passent par un système sécurisé. Ne partagez jamais vos 
          informations personnelles avec un tiers. Respectez les lois locales pour éviter tout problème juridique.
        </Text>
      </View>

      {/* Section 6: Lifestyle et inspiration */}
      <View style={styles.section}>
        <Text style={styles.title}>Lifestyle et inspiration</Text>

        <Text style={styles.subtitle}>1. Suggestions de destinations</Text>
        <Image
          source={{ uri: 'https://plus.unsplash.com/premium_photo-1723651354432-7796fb4ecebc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8U3VnZ2VzdGlvbnMlMjBkZSUyMGRlc3RpbmF0aW9uc3xlbnwwfHwwfHx8MA%3D%3D' }}
          style={styles.image}
        />
        <Text style={styles.text}>
          Explorez des destinations populaires selon la saison, comme les plages en été 
          ou les montagnes en hiver. Découvrez les attractions locales pour chaque région.
        </Text>

        <Text style={styles.subtitle}>2. Idées d'aménagement</Text>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1662557499872-8920a31e2f32?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
          style={styles.image}
        />
        <Text style={styles.text}>
          Rendez votre maison plus accueillante avec des décorations simples : 
          des plantes, des luminaires chaleureux, ou des meubles confortables.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 10,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    color: '#555',
    fontFamily: 'Poppins-SemiBold',
  },
  text: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    fontFamily: 'Poppins-Regular',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
});

export default TipsScreen;
