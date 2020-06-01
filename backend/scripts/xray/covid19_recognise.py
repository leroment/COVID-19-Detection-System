import cv2
import tensorflow as tf

CATEGORIES = ["Positive", "Negative"]

def prepare(filepath):
    IMG_SIZE = 224
    image = cv2.imread(filepath)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = cv2.resize(image, (IMG_SIZE, IMG_SIZE))
    return image.reshape(-1, IMG_SIZE, IMG_SIZE, 3)

model = tf.keras.models.load_model("covid19.model")

prediction = model.predict([prepare('covid.jpeg')])

print(prediction)

if (prediction[0][0]>prediction[0][1]):
    print("Negative")
    print("{:.3%}".format(prediction[0][0]))
elif (prediction[0][0]<prediction[0][1]):
    print("Positive")
    print("{:.3%}".format(prediction[0][1]))

