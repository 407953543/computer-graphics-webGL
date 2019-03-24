import sys
if __name__ == "__main__":
    words = "12+99-3"
    positive, temp, res = True, 0, 0
    for word in words:
        if word == '+' or word == '-':
            if positive == True:
                res += temp
                temp = 0
            else:
                res -= temp
                temp = 0
            if word == '+':
                positive = True
            else:
                positive = False
        else:
            temp = temp*10+int(word)
    if positive == True:
        print(res+temp)
    else:
        print(res-temp)