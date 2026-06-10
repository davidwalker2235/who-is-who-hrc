import { CaricatureFeatures } from "@/data/imagesData";

export interface CaricatureImage {
  name: string;
  src: string;
  size: string;
  features: number[];
}

export interface Question {
  id: number;
  text: string;
  feature: CaricatureFeatures;
}

export const questionFeatures: CaricatureFeatures[] = [
  CaricatureFeatures.GLASSES,
  CaricatureFeatures.BEARD,
  CaricatureFeatures.LONG_AIR,
  CaricatureFeatures.EARRINGS,
  CaricatureFeatures.MAN,
  CaricatureFeatures.GROUP,
  CaricatureFeatures.PET
];

export const createQuestionsFromTexts = (texts: string[]): Question[] =>
  questionFeatures.map((feature, index) => ({
    id: index + 1,
    text: texts[index] ?? "",
    feature
  }));

export const filterImagesBySequence = (images: CaricatureImage[], answers: boolean[]): CaricatureImage[] => {
  const petQuestionIndex = questionFeatures.findIndex(
    (feature) => feature === CaricatureFeatures.PET
  );

  // Si la pregunta de mascota es afirmativa, ignora el resto de respuestas y
  // filtra solo por la característica PET = 1.
  if (petQuestionIndex >= 0 && answers[petQuestionIndex] === true) {
    return images.filter(
      (image) => image.features[CaricatureFeatures.PET] === 1
    );
  }

  return images.filter(image => {
    // Verificar que la imagen cumpla con cada respuesta según su feature real.
    for (let i = 0; i < answers.length; i++) {
      const featureIndex = questionFeatures[i];
      if (featureIndex === undefined) continue;
      const expectedValue = answers[i] ? 1 : 0;
      if (image.features[featureIndex] !== expectedValue) {
        return false;
      }
    }
    return true;
  });
};

export const downloadImage = (imageSrc: string, imageName: string) => {
  const link = document.createElement('a');
  link.href = imageSrc;
  link.download = imageName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 