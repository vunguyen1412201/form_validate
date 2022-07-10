function Validator(options){
  var selectorRules = {};

  function validate(inputElement, rule){
     var errorMessage; 
     var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
     var rules = selectorRules[rule.selector];
     for(var i = 0; i < rules.length; i++){
       errorMessage = rules[i](inputElement.value);
       if(errorMessage) break;
     }
          if(errorMessage){
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
          }else{
            errorElement.innerText ="";
            inputElement.parentElement.classList.remove('invalid');

          }
 

  }
  var formElement = document.querySelector(options.form);
  if(formElement){
    //khi submit bỏ đi hành vi mặc định
    formElement.onsubmit = function(e){
      e.preventDefault();
      var isInvalid =true;
      options.rules.forEach(function (rule){
        var inputElement = formElement.querySelector(rule.selector);
         validate(inputElement, rule);



      });
    }
    
    options.rules.forEach(function (rule){

      //Lưu lại các rules cho mỗi input
      if(Array.isArray(selectorRules[rule.test])){
        selectorRules[rule.selector].push(rule.test);
      }else{
        selectorRules[rule.selector] = [rule.test];
      }


      var inputElement = formElement.querySelector(rule.selector);
      
      if(inputElement){
        //Xu ly blur ra khoi input
        inputElement.onblur = function(){
         validate(inputElement, rule);
        }
        //Xu ly moi khi nguoi dung nhap
        inputElement.oninput = function(){
          var errorElement = inputElement.parentElement.querySelector(options.errorSelector);

          errorElement.innerText ="";
          inputElement.parentElement.classList.remove('invalid');

        }
      }
    });
  }
}



//Dinh nghia rule
Validator.isRequired = function(selector){
  return {
    selector:selector,
    test: function(value){
      return value.trim() ? undefined : 'Vui lòng nhập trường này'
    }
  }
 }
Validator.isEmail = function(selector){ 
  return {
    selector:selector,
    test: function(value){
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      return regex.test(value) ? undefined : 'Vui lòng nhập email'
    }
  }
}

Validator.minLength = function(selector,  min){ 
  return {
    selector:selector,
    test: function(value){
      
      return value.length >= min ? undefined : `Nhập vào tối thiểu ${min} kí tự`;
    }
  }
}

Validator.isConfirmed = function(selector, getConfirmValue, message){
  return{
    selector:selector,
    test:function(value){
      return value == getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác'
    }
  }
}