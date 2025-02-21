import sys
import cv2
import tensorflow as tf

CATEGORIES = ["Positive", "Negative"]

def main(arg):
    model = tf.keras.models.load_model('api/scripts/xray-analysis/covid19.model')

    prediction = model.predict([prepare(arg)])

    confidence_value = prediction[0][1]

    confidence_value = "{:.3}".format(confidence_value*100)

    #print("{:.3}".format(prediction[0][1]))

    print (confidence_value)


def prepare(filepath):
    IMG_SIZE = 224
    image = cv2.imread(filepath)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = cv2.resize(image, (IMG_SIZE, IMG_SIZE))
    return image.reshape(-1, IMG_SIZE, IMG_SIZE, 3)

if __name__ == "__main__":
    main(sys.argv[1])
