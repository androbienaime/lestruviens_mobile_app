import React from 'react';
import { Text, View, Linking, Alert } from 'react-native';

type HTMLRendererProps = {
  html: string;
  withoutBalise?: boolean;
};

const openLinkSafely = (url: string) => {
  Alert.alert(
    'En ouvrant ce lien vous allez quitter cette page ?',
    url,
    [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Oui',
        onPress: () => Linking.openURL(url),
      },
    ],
    { cancelable: true }
  );
};

const RenderHTMLToText = (html: string, withoutBalise = false): React.ReactNode[] => {
  const elements: React.ReactNode[] = [];

  if(html == null){
    html = "";
  }
  // Si withoutBalise, on nettoie tout sauf les liens
  if (withoutBalise) {
    // Convertir <a href="...">label</a> en juste l'URL (ou garder le texte du lien ?)
    html = html.replace(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, '$1');

    // Supprimer toutes les balises restantes
    html = html.replace(/<[^>]+>/g, '');
  }

  // Si NOT withoutBalise, parser et interpréter certaines balises de style
  if (!withoutBalise) {
    // Remplacer <p> par doubles sauts de ligne
    html = html.replace(/<\/?p>/gi, '\n\n');

    // Gras
    html = html.replace(/<b>(.*?)<\/b>/gi, '*$1*');
    // Italique
    html = html.replace(/<i>(.*?)<\/i>/gi, '_$1_');

    // Remplacer <a href="...">label</a> par __LINK__[label](url)__ pour le détecter
    html = html.replace(
      /<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi,
      '__LINK__[$2]($1)__'
    );

    // Supprimer autres balises
    html = html.replace(/<[^>]+>/g, '');
  }

  // Séparer par liens et textes
  const parts = html.split(/(https?:\/\/[^\s]+)/g);

  for (let part of parts) {
    // Si c'est une structure de lien formatée (via <a>)
    if (part.includes('__LINK__')) {
      const linkMatches = [...part.matchAll(/__LINK__\[(.*?)\]\((.*?)\)__/g)];
      let lastIndex = 0;

      for (let match of linkMatches) {
        const before = part.substring(lastIndex, match.index);
        const label = match[1];
        const url = match[2];
        lastIndex = match.index! + match[0].length;

        if (before) {
          elements.push(<Text key={elements.length}>{before}</Text>);
        }

        elements.push(
          <Text
            key={elements.length}
            style={{ color: 'blue', textDecorationLine: 'underline' }}
            onPress={() => openLinkSafely(url)}
          >
            {label}
          </Text>
        );
      }

      // Si du texte après le dernier lien
      const after = part.substring(lastIndex);
      if (after) {
        elements.push(<Text key={elements.length}>{after}</Text>);
      }
    }

    // Liens directs
    else if (part.match(/^https?:\/\/[^\s]+$/)) {
      elements.push(
        <Text
          key={elements.length}
          style={{ color: 'blue', textDecorationLine: 'underline' }}
          onPress={() => openLinkSafely(part)}
        >
          {part}
        </Text>
      );
    }

    // Texte simple
    else if (part.trim() !== '') {
      elements.push(<Text key={elements.length}>{part}</Text>);
    }
  }

  return elements;
};


export default RenderHTMLToText;