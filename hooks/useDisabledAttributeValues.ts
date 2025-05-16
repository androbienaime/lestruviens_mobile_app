import { Declination, Values } from '@/src/@types/models';
import { useMemo } from 'react';

interface DeclinationMatrix {
  [attributeName: string]: Set<string>; // Les valeurs désactivées par attribut
}

export const useDisabledAttributeValues = (
  declinations: Declination[],
  selected: Record<string, string>
): DeclinationMatrix => {
  return useMemo(() => {
    const disabled: DeclinationMatrix = {};

    // Si pas de déclinaisons, retourner un objet vide
    if (!declinations || declinations.length === 0) {
      return disabled;
    }

    // 1. Identifier tous les attributs présents
    const allAttributeNames = new Set<string>();
    declinations.forEach(d => {
      d.values.forEach(v => {
        allAttributeNames.add(v.attribute.name);
      });
    });

    // 2. Identifier le nombre d'attributs par déclinaison
    // Extraire le nombre attendu d'attributs uniques depuis la première déclinaison (toutes devraient avoir le même nombre)
    const firstDecl = declinations[0];
    const uniqueAttrsInFirstDecl = new Set(firstDecl.values.map(v => v.attribute.name));
    const attributesPerDeclination = uniqueAttrsInFirstDecl.size;

    // Si aucun attribut trouvé
    if (attributesPerDeclination === 0) {
      return disabled;
    }

    // 3. Filtrer les déclinaisons valides (avec stock positif et le bon nombre d'attributs)
    const validDeclinations = declinations.filter(d => {
      // Vérifier si la déclinaison a du stock
      if (d.quantity <= 0) return false;
      
      // Vérifier si la déclinaison a le bon nombre d'attributs uniques
      const uniqueAttrs = new Set(d.values.map(v => v.attribute.name));
      return uniqueAttrs.size === attributesPerDeclination;
    });

    // 4. Calcul pour chaque attribut
    allAttributeNames.forEach((attributeName) => {
      // On retire l'attribut courant des critères de sélection
      const otherSelected = { ...selected };
      delete otherSelected[attributeName];

      const validValueIds = new Set<string>();

      // Vérifie pour chaque déclinaison
      validDeclinations.forEach(declination => {
        // Mapper les attributs de la déclinaison vers leur valeur d'ID
        const declAttrs: Record<string, string> = {};
        declination.values.forEach(v => {
          declAttrs[v.attribute.name] = v.id.toString();
        });

        // Vérifier si la déclinaison correspond aux attributs sélectionnés
        // Si certains attributs ne sont pas encore sélectionnés, on les considère comme matchant
        const matches = Object.entries(otherSelected).every(([attr, valId]) => {
          return !declAttrs[attr] || declAttrs[attr] === valId;
        });

        // Si c'est un match, la valeur pour l'attribut courant est valide
        if (matches) {
          const value = declination.values.find(v => v.attribute.name === attributeName);
          if (value) {
            validValueIds.add(value.id.toString());
          }
        }
      });

      // 5. Collecter toutes les valeurs possibles pour cet attribut
      const allValueIdsForAttr = new Set<string>();
      declinations.forEach(d => {
        d.values.forEach(v => {
          if (v.attribute.name === attributeName) {
            allValueIdsForAttr.add(v.id.toString());
          }
        });
      });

      // 6. Désactiver les valeurs qui ne sont pas disponibles
      const disabledValues = new Set<string>();
      allValueIdsForAttr.forEach(id => {
        if (!validValueIds.has(id)) {
          disabledValues.add(id);
        }
      });

      disabled[attributeName] = disabledValues;
    });

    return disabled;
  }, [declinations, selected]);
};

export default useDisabledAttributeValues;