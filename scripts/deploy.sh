export ABSOLUTE_BUILD_PATH=ui/build
export STATIC_PATH=api/app/static
export DEVELOPMENT=False

rm -rf $ABSOLUTE_BUILD_PATH

cd ui && yarn install --silent && yarn build && cd ..

rm -rf $STATIC_PATH
mv $ABSOLUTE_BUILD_PATH $STATIC_PATH
mv $STATIC_PATH/static/* $STATIC_PATH


pip install -r api/requirements.txt -q --upgrade
ps aux | grep "uvicorn" | awk '{print $2}' | xargs kill
sleep 10 # Buffer to make sure servers stop
cd api

nohup python -m uvicorn app.main:app --port=8000 --host 0.0.0.0 &
